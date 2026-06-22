const express = require("express");
const prisma = require("../prisma");
const auth = require("../middleware/auth");
const redis = require("../config/redis");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    // Redis Cache Check
    const cacheKey = `recommendations:${currentUserId}`;

    const cachedRecommendations =
      await redis.get(cacheKey);

    if (cachedRecommendations) {
      console.log("Cache HIT");

      return res.json(
        JSON.parse(cachedRecommendations)
      );
    }

    console.log("Cache MISS");

    // Get current user's ratings
    const myRatings = await prisma.Rating.findMany({
      where: {
        user_id: currentUserId,
      },
    });

    // Cold start check
    if (myRatings.length < 3) {
      const popularMovies = await prisma.Movie.findMany({
        take: 10,
      });

      const response = {
        message:
          "Not enough rating history. Showing popular movies.",
        recommendations: popularMovies,
      };

      await redis.set(
        cacheKey,
        JSON.stringify(response),
        {
          EX: 3600,
        }
      );

      return res.json(response);
    }

    const myMovieIds = myRatings.map(
      (rating) => rating.movie_id
    );

    // Find ratings from other users on movies I've rated
    const similarUsersRatings =
      await prisma.Rating.findMany({
        where: {
          movie_id: {
            in: myMovieIds,
          },
          user_id: {
            not: currentUserId,
          },
        },
      });

    // Calculate similarity score
    const userSimilarity = {};

    similarUsersRatings.forEach((rating) => {
      const userId = rating.user_id;

      userSimilarity[userId] =
        (userSimilarity[userId] || 0) + 1;
    });

    const similarUserIds = Object.keys(
      userSimilarity
    ).map(Number);

    if (similarUserIds.length === 0) {
      const response = {
        message:
          "No similar users found yet. Rate more movies.",
        recommendations: [],
      };

      await redis.set(
        cacheKey,
        JSON.stringify(response),
        {
          EX: 3600,
        }
      );

      return res.json(response);
    }

    // Movies rated by similar users but not by current user
    const candidateRatings =
      await prisma.Rating.findMany({
        where: {
          user_id: {
            in: similarUserIds,
          },
          movie_id: {
            notIn: myMovieIds,
          },
        },
        include: {
          movie: true,
        },
      });

    const movieScores = {};

    candidateRatings.forEach((rating) => {
      const movieId = rating.movie_id;

      if (!movieScores[movieId]) {
        movieScores[movieId] = {
          movie: rating.movie,
          weightedScore: 0,
          totalWeight: 0,
        };
      }

      const similarityWeight =
        userSimilarity[rating.user_id] || 1;

      movieScores[movieId].weightedScore +=
        Number(rating.rating) *
        similarityWeight;

      movieScores[movieId].totalWeight +=
        similarityWeight;
    });

    const recommendations = Object.values(
      movieScores
    )
      .map((item) => ({
        movieId: item.movie.id,
        title: item.movie.title,
        genres: item.movie.genres,
        poster: item.movie.poster,

        recommendationScore: Number(
          (
            item.weightedScore /
            item.totalWeight
          ).toFixed(2)
        ),

        similarUsers: item.totalWeight,

        reason:
          "Users with similar rating patterns enjoyed this movie",
      }))
      .sort(
        (a, b) =>
          b.recommendationScore -
          a.recommendationScore
      )
      .slice(0, 10);

    if (recommendations.length === 0) {
      const popularMovies =
        await prisma.Movie.findMany({
          take: 10,
        });

      const response = {
        message:
          "No personalized recommendations available yet.",
        recommendations: popularMovies,
      };

      await redis.set(
        cacheKey,
        JSON.stringify(response),
        {
          EX: 3600,
        }
      );

      return res.json(response);
    }

    const response = {
      totalRecommendations:
        recommendations.length,
      recommendations,
    };

    // Store in Redis for 1 hour
    await redis.set(
      cacheKey,
      JSON.stringify(response),
      {
        EX: 3600,
      }
    );

    res.json(response);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;