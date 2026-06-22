const express = require("express");
const prisma = require("../prisma");
const auth = require("../middleware/auth");
const redis = require("../config/redis");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { movieId, rating } = req.body;

    if (!movieId || rating === undefined) {
      return res.status(400).json({
        message: "movieId and rating are required",
      });
    }

    if (rating < 0.5 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 0.5 and 5",
      });
    }

    const savedRating = await prisma.Rating.upsert({
      where: {
        user_id_movie_id: {
          user_id: req.user.userId,
          movie_id: Number(movieId),
        },
      },

      update: {
        rating,
      },

      create: {
        user_id: req.user.userId,
        movie_id: Number(movieId),
        rating,
      },
    });

    // Clear recommendation cache for this user
    await redis.del(
      `recommendations:${req.user.userId}`
    );

    res.status(200).json({
      message: "Rating saved successfully",
      rating: savedRating,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const ratings = await prisma.Rating.findMany({
      where: {
        user_id: req.user.userId,
      },

      include: {
        movie: {
          select: {
            id: true,
            title: true,
            genres: true,
          },
        },
      },

      orderBy: {
        created_at: "desc",
      },
    });

    res.json(ratings);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.delete("/:movieId", auth, async (req, res) => {
  try {
    await prisma.Rating.delete({
      where: {
        user_id_movie_id: {
          user_id: req.user.userId,
          movie_id: Number(req.params.movieId),
        },
      },
    });

    // Clear recommendation cache for this user
    await redis.del(
      `recommendations:${req.user.userId}`
    );

    res.json({
      message: "Rating deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;