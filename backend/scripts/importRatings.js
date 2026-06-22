const fs = require("fs");
const csv = require("csv-parser");
const prisma = require("../src/prisma");

const ratings = [];

fs.createReadStream("dataset/ratings.csv")
  .pipe(csv())
  .on("data", (row) => {
    ratings.push({
      user_id: Number(row.userId),
      movie_id: Number(row.movieId),
      rating: Number(row.rating),
    });
  })
  .on("end", async () => {
    console.log(`Read ${ratings.length} ratings`);

    try {
      await prisma.Rating.createMany({
        data: ratings,
        skipDuplicates: true,
      });

      console.log(
        "Ratings imported successfully"
      );

    } catch (error) {
      console.error(error);

    } finally {
      await prisma.$disconnect();
    }
  });