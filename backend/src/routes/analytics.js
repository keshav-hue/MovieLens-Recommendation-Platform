const express = require("express");
const prisma = require("../prisma");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const ratings = await prisma.Rating.findMany({
      where: {
        user_id: userId,
      },
      include: {
        movie: true,
      },
    });

    const totalRatings = ratings.length;

    const averageRating =
      totalRatings > 0
        ? ratings.reduce(
            (sum, r) => sum + Number(r.rating),
            0
          ) / totalRatings
        : 0;

    const genreCount = {};

    ratings.forEach((rating) => {
      if (!rating.movie?.genres) return;

      const genres = rating.movie.genres.split("|");

      genres.forEach((genre) => {
        genreCount[genre] =
          (genreCount[genre] || 0) + 1;
      });
    });

    let favoriteGenre = null;
    let maxCount = 0;

    for (const genre in genreCount) {
      if (genreCount[genre] > maxCount) {
        maxCount = genreCount[genre];
        favoriteGenre = genre;
      }
    }

    res.json({
      totalRatings,
      averageRating: Number(
        averageRating.toFixed(2)
      ),
      favoriteGenre,
      genreBreakdown: genreCount,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/platform", async (req, res) => {
  try {
    const totalUsers = await prisma.User.count();

    const totalMovies = await prisma.Movie.count();

    const totalRatings = await prisma.Rating.count();

    const avgRating = await prisma.Rating.aggregate({
      _avg: {
        rating: true,
      },
    });

    const topRatedMovies = await prisma.Rating.groupBy({
      by: ["movie_id"],

      _avg: {
        rating: true,
      },

      _count: {
        rating: true,
      },

      orderBy: {
        _avg: {
          rating: "desc",
        },
      },

      take: 5,
    });

    const movieIds = topRatedMovies.map(
      (movie) => movie.movie_id
    );

    const movies = await prisma.Movie.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
    });

    const topMovies = topRatedMovies.map((item) => {
      const movie = movies.find(
        (m) => m.id === item.movie_id
      );

      return {
        movieId: item.movie_id,
        title: movie?.title,
        avgRating: Number(item._avg.rating),
        ratingCount: item._count.rating,
      };
    });

    res.json({
      totalUsers,
      totalMovies,
      totalRatings,

      averagePlatformRating: Number(
        avgRating._avg.rating || 0
      ).toFixed(2),

      topMovies,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;