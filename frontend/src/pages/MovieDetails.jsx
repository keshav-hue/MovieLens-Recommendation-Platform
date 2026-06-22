import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";

import { getMovieById } from "../api/movies";
import { rateMovie } from "../api/ratings";

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      console.log("Fetching movie:", id);

      const data = await getMovieById(id);

      console.log("Movie data:", data);

      setMovie(data);
    } catch (err) {
      console.error(
        "Failed to fetch movie:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (
    movieId,
    rating
  ) => {
    try {
      await rateMovie(movieId, rating);
      await fetchMovie();
      alert(
        `Rated ${movie.title} ${rating} stars`
      );
    } catch (err) {
      console.error(err);

      alert("Failed to save rating");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="p-8 text-xl">
          Loading movie...
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Navbar />

        <div className="p-8 text-red-500 text-xl">
          Movie not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img
              src={
                movie.poster ||
                "https://placehold.co/400x600?text=MovieLens"
              }
              alt={movie.title}
              className="rounded-xl shadow-lg w-full"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold">
              {movie.title}
            </h1>

            <div className="mt-6">
              <h2 className="font-semibold text-lg">
                Genres
              </h2>

              <p className="text-gray-600">
                {movie.genres?.replaceAll(
                  "|",
                  ", "
                ) || "Unknown"}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold text-lg">
                Year
              </h2>

              <p className="text-gray-600">
                {movie.year || "Unknown"}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">
                Rate This Movie
              </h2>

              <StarRating
                movieId={movie.id}
                onRate={handleRating}
              />
            </div>
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">
                Average Rated:
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-3xl">
                  ⭐
                </span>
                <span className="text-2xl font-semibold">
                  {movie.averageRating
                    ? movie.averageRating.toFixed(1)
                    : "N/A"}
                </span>
                <span className="text-gray-500">
                  ({movie.ratingCount || 0} ratings)
                </span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}