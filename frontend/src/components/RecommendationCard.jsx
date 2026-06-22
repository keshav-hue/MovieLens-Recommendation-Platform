export default function RecommendationCard({
  recommendation,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
      <h2 className="text-xl font-bold">
        {recommendation.title}
      </h2>

      <p className="text-gray-500 mt-2">
        {recommendation.genres?.replaceAll(
          "|",
          ", "
        )}
      </p>

      <div className="mt-4">
        <span className="font-semibold">
          Recommendation Score:
        </span>

        <span className="ml-2 text-green-600 font-bold">
          {recommendation.recommendationScore}
        </span>
      </div>

      <div className="mt-2">
        <span className="font-semibold">
          Similar Users:
        </span>

        <span className="ml-2">
          {recommendation.similarUsers}
        </span>
      </div>

      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 {recommendation.reason}
        </p>
      </div>
    </div>
  );
}