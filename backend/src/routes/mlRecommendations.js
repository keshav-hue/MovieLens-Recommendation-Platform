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

    let recommendations;

    try {
      const response = await axios.get(
        `${process.env.ML_SERVICE_URL}/recommend/${userId}`,
        {
          timeout: 15000,
        }
      );

      recommendations =
        response.data;

      console.log(
        "ML Service Success"
      );

    } catch (mlError) {

      console.log(
        "ML Service unavailable, using fallback"
      );

      const popularMovies =
        await prisma.Rating.groupBy({
          by: ["movie_id"],

          _count: {
            rating: true,
          },

          orderBy: {
            _count: {
              rating: "desc",
            },
          },

          take: 20,
        });

      recommendations =
        popularMovies.map(
          (movie) => ({
            movieId: movie.movie_id,
            score: "Popular Movie",
          })
        );
    }

    const movieIds =
      recommendations.map(
        (movie) => movie.movieId
      );

    const movies =
      await prisma.Movie.findMany({
        where: {
          id: {
            in: movieIds,
          },
        },
      });

    const movieMap = {};

    movies.forEach((movie) => {
      movieMap[movie.id] = movie;
    });

    const enrichedRecommendations =
      recommendations.map((rec) => ({
        ...rec,

        title:
          movieMap[rec.movieId]
            ?.title || null,

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
        "Recommendation service unavailable",
    });
  }
});

module.exports = router;