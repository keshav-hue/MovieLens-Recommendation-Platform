const express = require("express");
const axios = require("axios");

const prisma = require("../prisma");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/fetch-posters", auth, async (req, res) => {
  try {
    const limit = Number(req.body.limit) || 50;

    const movies = await prisma.Movie.findMany({
      where: {
        poster: null,
      },
      take: limit,
      orderBy: {
        id: "asc",
      },
    });

    let updated = 0;
    let skipped = 0;

    for (const movie of movies) {
      try {
        // Extract release year
        const yearMatch =
          movie.title.match(/\((\d{4})\)$/);

        const year = yearMatch
          ? Number(yearMatch[1])
          : undefined;

        let cleanedTitle;

        // Prefer alternate title if present
        const akaMatch =
          movie.title.match(
            /\(a\.k\.a\.\s*(.*?)\)/i
          );

        if (akaMatch) {
          cleanedTitle = akaMatch[1];
        } else {
          cleanedTitle = movie.title
            .replace(/\((\d{4})\)$/g, "")
            .replace(/\(.*?\)/g, "")
            .trim();
        }

        console.log(
          `Searching TMDB: "${cleanedTitle}" (${year || "unknown"})`
        );

        const searchResponse =
          await axios.get(
            "https://api.themoviedb.org/3/search/movie",
            {
              params: {
                api_key:
                  process.env.TMDB_API_KEY,
                query: cleanedTitle,
                year,
              },
            }
          );

        const result =
          searchResponse.data.results?.[0];

        if (!result) {
          console.log(
            `No TMDB match: ${movie.title}`
          );

          skipped++;
          continue;
        }

        let posterUrl = null;

        // Normal poster
        if (result.poster_path) {
          posterUrl =
            `https://image.tmdb.org/t/p/w500${result.poster_path}`;
        }

        // Fallback: fetch images endpoint
        else {
          const imageResponse =
            await axios.get(
              `https://api.themoviedb.org/3/movie/${result.id}/images`,
              {
                params: {
                  api_key:
                    process.env.TMDB_API_KEY,
                },
              }
            );

          const firstPoster =
            imageResponse.data.posters?.[0];

          if (firstPoster) {
            posterUrl =
              `https://image.tmdb.org/t/p/w500${firstPoster.file_path}`;
          }
        }

        if (!posterUrl) {
          console.log(
            `No poster available: ${movie.title}`
          );

          skipped++;
          continue;
        }

        await prisma.Movie.update({
          where: {
            id: movie.id,
          },
          data: {
            poster: posterUrl,
          },
        });

        updated++;

        console.log(
          `✓ Updated poster: ${movie.title}`
        );

        // TMDB rate-limit protection
        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        );

      } catch (movieError) {
        console.error(
          `✗ Failed: ${movie.title}`,
          movieError.message
        );

        skipped++;
      }
    }

    res.json({
      success: true,
      processed: movies.length,
      updated,
      skipped,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


const { exec } = require("child_process");


router.post("/retrain", async (req, res) => {
  try {
    const response = await axios.post(
      "http://ml-service:8000/retrain"
    );

    const keys = await redis.keys("ml:*");

    for (const key of keys) {
      await redis.del(key);
    }
    res.json(response.data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Retraining failed",
    });
  }
});

module.exports = router;