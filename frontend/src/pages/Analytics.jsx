import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {
  getPlatformAnalytics,
  getUserAnalytics,
} from "../api/analytics";

import { fetchPosters } from "../api/admin";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function Analytics() {
  const [platform, setPlatform] = useState(null);

  const [userAnalytics, setUserAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [platformData, userData] =
        await Promise.all([
          getPlatformAnalytics(),
          getUserAnalytics(),
        ]);

      console.log(
        "Platform Analytics:",
        platformData
      );

      console.log(
        "User Analytics:",
        userData
      );

      setPlatform(platformData);
      setUserAnalytics(userData);
    } catch (err) {
      console.error(
        "Analytics Error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPosters = async () => {
    try {
      const result =
        await fetchPosters(50);

      alert(
        `Updated ${result.updated} posters`
      );

      fetchAnalytics();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to fetch posters"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-xl">
          Loading Analytics...
        </div>
      </>
    );
  }

  if (!platform || !userAnalytics) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-red-500">
          Failed to load analytics.
        </div>
      </>
    );
  }

  const genreData = Object.entries(
    userAnalytics.genreBreakdown || {}
  ).map(([genre, count]) => ({
    name: genre,
    value: count,
  }));

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            📊 Analytics Dashboard
          </h1>

          <button
            onClick={handleFetchPosters}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Fetch Missing Posters
          </button>
        </div>

        {/* Platform Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Users"
            value={platform.totalUsers}
          />

          <StatCard
            title="Movies"
            value={platform.totalMovies}
          />

          <StatCard
            title="Ratings"
            value={platform.totalRatings}
          />

          <StatCard
            title="Avg Rating"
            value={
              platform.averagePlatformRating
            }
          />
        </div>

        {/* User Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="My Ratings"
            value={
              userAnalytics.totalRatings
            }
          />

          <StatCard
            title="Average Given"
            value={
              userAnalytics.averageRating
            }
          />

          <StatCard
            title="Favorite Genre"
            value={
              userAnalytics.favoriteGenre ||
              "N/A"
            }
          />
        </div>

        {/* Charts */}

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-bold text-xl mb-4">
              Genre Preferences
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={genreData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {genreData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-bold text-xl mb-4">
              Top Rated Movies
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={
                  platform.topMovies || []
                }
              >
                <XAxis
                  dataKey="title"
                  hide
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="avgRating"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Movies Table */}

        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Top Movies
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">
                  Movie
                </th>

                <th className="text-left">
                  Avg Rating
                </th>

                <th className="text-left">
                  Ratings
                </th>
              </tr>
            </thead>

            <tbody>
              {(platform.topMovies || []).map(
                (movie) => (
                  <tr
                    key={movie.movieId}
                    className="border-b"
                  >
                    <td className="py-3">
                      {movie.title}
                    </td>

                    <td>
                      ⭐ {movie.avgRating}
                    </td>

                    <td>
                      {
                        movie.ratingCount
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({
  title,
  value,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}