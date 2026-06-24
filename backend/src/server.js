require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");

const redis = require("./config/redis");

const authRoute = require("./routes/auth");
const ratingsRoute = require("./routes/rating");
const moviesRoute = require("./routes/movies");
const recommendationsRoute = require("./routes/recommendations");
const mlRecommendationsRoute = require("./routes/mlRecommendations");
const analyticsRoute = require("./routes/analytics");
const adminRoutes = require("./routes/admin");

const app = express();

/*
Middleware
*/
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "https://movie-lens-recommendation-platform.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

/*
Routes
*/
app.use("/movies", moviesRoute);
app.use("/auth", authRoute);
app.use("/ratings", ratingsRoute);
app.use("/recommendations", recommendationsRoute);
app.use("/recommendations/ml", mlRecommendationsRoute);
app.use("/analytics", analyticsRoute);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("MovieLens API Running");
});

/*
Warm ML Service
*/
async function warmMLService() {
  try {
    if (!process.env.ML_SERVICE_URL) {
      console.log(
        "ML_SERVICE_URL not configured"
      );
      return;
    }

    console.log(
      "Warming ML Service..."
    );

    await axios.get(
      `${process.env.ML_SERVICE_URL}/recommend/1`,
      {
        timeout: 15000,
      }
    );

    console.log(
      "ML Service Warmed Successfully"
    );
  } catch (err) {
    console.log(
      "ML Warmup Failed:",
      err.message
    );
  }
}

/*
Health Check
*/
app.get("/health", async (req, res) => {
  try {
    await redis.ping();

    res.json({
      status: "healthy",
      redis: "connected",
      timestamp:
        new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      status: "unhealthy",
    });
  }
});

/*
Start Server
*/
const PORT =
  process.env.PORT || 5668;

app.listen(PORT, async () => {
  console.log(
    `Server running on ${PORT}`
  );

  await warmMLService();
});