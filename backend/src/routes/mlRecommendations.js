const express = require("express");
const axios = require("axios");

const auth = require("../middleware/auth");
const redis = require("../config/redis");
const prisma = require("../prisma");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const cacheKey = `ml:${userId}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("ML Cache HIT");

      return res.json(
        JSON.parse(cached)
      );
    }

    console.log("ML Cache MISS");

    const response = await axios.get(
      `http://ml-service:8000/recommend/${userId}`
    );

    const recommendations =
      response.data;

    // Get movie IDs returned by ML service
    const movieIds =
      recommendations.map(
        (movie) => movie.movieId
      );

    // Fetch posters + metadata from PostgreSQL
    const movies =
      await prisma.Movie.findMany({
        where: {
          id: {
            in: movieIds,
          },
        },
      });

    // Create lookup map
    const movieMap = {};

    movies.forEach((movie) => {
      movieMap[movie.id] = movie;
    });

    // Merge ML results with DB data
    const enrichedRecommendations =
      recommendations.map((rec) => ({
        ...rec,
        poster:
          movieMap[rec.movieId]
            ?.poster || null,
        genres:
          movieMap[rec.movieId]
            ?.genres || null,
        year:
          movieMap[rec.movieId]
            ?.year || null,
      }));

    const result = {
      recommendations:
        enrichedRecommendations,
    };

    await redis.setEx(
      cacheKey,
      3600,
      JSON.stringify(result)
    );

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "ML recommendation service unavailable",
    });
  }
});

module.exports = router;