const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

/*
GET /movies?page=1&limit=20
*/
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const movies = await prisma.Movie.findMany({
      skip,
      take: limit,
    });

    const totalMovies = await prisma.Movie.count();

    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
      totalMovies,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

/*
GET /movies/search?q=batman
*/
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || !query.trim()) {
      return res.json([]);
    }

    const movies = await prisma.Movie.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 50,
    });

    res.json(movies);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

/*
GET /movies/genres
*/
router.get("/genres", async (req, res) => {
  try {
    const movies = await prisma.Movie.findMany({
      select: {
        genres: true,
      },
    });

    const genresSet = new Set();

    movies.forEach((movie) => {
      if (!movie.genres) return;

      movie.genres.split("|").forEach((genre) => {
        genresSet.add(genre);
      });
    });

    res.json(
      [...genresSet].sort()
    );

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

/*
GET /movies/top-rated
*/
router.get("/top-rated", async (req, res) => {
  try {
    const topRated = await prisma.Rating.groupBy({
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

      take: 20,
    });

    const movieIds = topRated.map(
      (item) => item.movie_id
    );

    const movies = await prisma.Movie.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
    });

    const result = topRated.map((item) => {
      const movie = movies.find(
        (m) => m.id === item.movie_id
      );

      return {
        movieId: item.movie_id,
        title: movie?.title,
        genres: movie?.genres,
        poster: movie?.poster,
        avgRating: Number(item._avg.rating),
        ratingCount: item._count.rating,
      };
    });

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/genre/:genre", async (req, res) => {

  try {

    const genre = req.params.genre;

    const movies = await prisma.Movie.findMany({

      where: {

        genres: {

          contains: genre,

        },

      },

      take: 20,

      orderBy: {

        id: "asc",

      },

    });

    res.json(movies);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      message: "Internal Server Error",

    });

  }

});

/*
GET /movies/:id
*/
router.get("/:id", async (req, res) => {
  try {
    const movieId = Number(req.params.id);

    const movie = await prisma.Movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const ratingStats =
      await prisma.Rating.aggregate({
        where: {
          movie_id: movieId,
        },

        _avg: {
          rating: true,
        },

        _count: {
          rating: true,
        },
      });

    res.json({
      ...movie,

      averageRating:
        ratingStats._avg.rating
          ? Number(ratingStats._avg.rating)
          : null,

      ratingCount:
        ratingStats._count.rating,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;