import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import RecommendationCard from "../components/RecommendationCard";

import { getRecommendations } from "../api/recommendations";

export default function Recommendations() {
  const [recommendations, setRecommendations] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data =
        await getRecommendations();

      console.log(data);

      if (data.message) {
        setMessage(data.message);
      }

      setRecommendations(
        data.recommendations || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          Loading Recommendations...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">
          🎯 Recommended For You
        </h1>

        {message && (
          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {recommendations.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No recommendations yet.
            Rate more movies to improve
            recommendations.
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-8">
              Personalized recommendations
              based on users with similar
              rating patterns.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(
                (recommendation) => (
                  <RecommendationCard
                    key={
                      recommendation.movieId
                    }
                    recommendation={
                      recommendation
                    }
                  />
                )
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}