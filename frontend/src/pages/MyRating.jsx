import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getMyRatings,
  deleteRating,
} from "../api/ratings";

export default function MyRatings() {
  const [ratings, setRatings] =
    useState([]);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const data = await getMyRatings();
      setRatings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (
    movieId
  ) => {
    try {
      await deleteRating(movieId);

      setRatings(
        ratings.filter(
          (r) => r.movie_id !== movieId
        )
      );

    } catch (err) {
      console.error(err);
      alert("Failed to delete rating");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">
          My Ratings
        </h1>
        {ratings.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            You haven't rated any movies yet.
          </div>
        )}
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div
              key={rating.movie_id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold">
                  {rating.movie.title}
                </h2>

                <p>
                  Rating: ⭐ {rating.rating}
                </p>

                <p>
                  {rating.movie.genres}
                </p>
              </div>

              <button
                onClick={() =>
                  handleDelete(
                    rating.movie_id
                  )
                }
                className="
                  bg-red-500
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-red-600
                "
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}