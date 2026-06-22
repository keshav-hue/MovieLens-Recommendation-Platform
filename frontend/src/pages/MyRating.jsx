import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import { getMyRatings } from "../api/ratings";

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

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">
          My Ratings
        </h1>

        <div className="space-y-4">
          {ratings.map((rating) => (
            <div
              key={rating.movie_id}
              className="bg-white p-4 rounded-xl shadow"
            >
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
          ))}
        </div>
      </div>
    </>
  );
}