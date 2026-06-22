require("dotenv").config();
const redis = require("./config/redis");
const mlRecommendationsRoute =
  require("./routes/mlRecommendations");

const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

const authRoute = require("./routes/auth");
const ratingsRoute = require("./routes/rating");
const moviesRoute = require("./routes/movies");
const recommendationsRoute = require("./routes/recommendations");
const analyticsRoute = require("./routes/analytics");
const adminRoutes = require("./routes/admin");

app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    })
);
app.use(express.json());

app.use("/movies", moviesRoute);
app.use("/auth", authRoute);
app.use("/ratings", ratingsRoute);
app.use("/recommendations", recommendationsRoute);
app.use("/analytics", analyticsRoute);
app.use("/admin", adminRoutes);
app.use("/recommendations/ml", mlRecommendationsRoute);

app.get("/", (req, res) => {
  res.send("MovieLens API Running");
});

const PORT = 5668;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});