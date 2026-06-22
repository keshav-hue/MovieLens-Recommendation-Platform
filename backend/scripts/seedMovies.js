const fs = require("fs");
const csv = require("csv-parser");
const prisma = require("../src/prisma");

const movies = [];

fs.createReadStream("dataset/movies.csv")
  .pipe(csv())
  .on("data", (row) => {
    movies.push({
      id: Number(row.movieId),
      title: row.title,
      genres: row.genres,
    });
  })
  .on("end", async () => {
    console.log(`Read ${movies.length} movies`);

    try {
      await prisma.Movie.createMany({
        data: movies,
        skipDuplicates: true,
      });

      console.log("Movies imported successfully");

    } catch (error) {
      console.error(error);

    } finally {
      await prisma.$disconnect();
    }
  });