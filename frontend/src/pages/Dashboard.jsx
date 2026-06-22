import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

import {
  getMovies,
  searchMovies,
  getTopRatedMovies,
  getMoviesByGenre,
} from "../api/movies";

import { getMLRecommendations } from "../api/recommendations";

export default function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const username =
    user?.name || "Movie Lover";
  const [search, setSearch] = useState("");

  const [movies, setMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [recommendations, setRecommendations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadHomePage();
  }, []);

  const [actionMovies, setActionMovies] =
    useState([]);

  const [comedyMovies, setComedyMovies] =
    useState([]);

  const [dramaMovies, setDramaMovies] =
    useState([]);

  const [sciFiMovies, setSciFiMovies] =
    useState([]);

  const [thrillerMovies, setThrillerMovies] =
    useState([]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        if (!search.trim()) {
          loadHomePage();
          return;
        }

        const results =
          await searchMovies(search);

        setMovies(results);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const loadHomePage = async () => {
    try {
      setLoading(true);

      const [
        movieData,
        topRatedData,
        recommendationData,
        actionData,
        comedyData,
        dramaData,
        sciFiData,
        thrillerData,
      ] = await Promise.all([
        getMovies(1),
        getTopRatedMovies(),
        getMLRecommendations(),

        getMoviesByGenre("Action"),
        getMoviesByGenre("Comedy"),
        getMoviesByGenre("Drama"),
        getMoviesByGenre("Sci-Fi"),
        getMoviesByGenre("Thriller"),
      ]);

      setMovies(
        movieData.movies || movieData
      );

      setTopRated(topRatedData);

      setRecommendations(
        recommendationData.recommendations ||
          []
      );

      setActionMovies(actionData);
      setComedyMovies(comedyData);
      setDramaMovies(dramaData);
      setSciFiMovies(sciFiData);
      setThrillerMovies(thrillerData);
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

        <div className="bg-black min-h-screen flex justify-center items-center">
          <div className="text-white text-2xl">
            Loading MovieLens...
          </div>
        </div>
      </>
    );
  }

  const heroMovie =

    recommendations[0] ||

    topRated[0] ||

    movies[0];


  return (

    <>

      <Navbar />

      <div className="bg-black min-h-screen text-white">

        {/* Search */}

        <div className="max-w-7xl mx-auto px-8 pt-6">

          <input

            type="text"

            placeholder="Search movies..."

            value={search}

            onChange={(e) =>

              setSearch(e.target.value)

            }

            className="

              w-full

              p-4

              rounded-xl

              bg-gray-900

              border

              border-gray-700

              text-white

              focus:outline-none

              focus:ring-2

              focus:ring-red-600

            "

          />

        </div>

        {search.trim() ? (

          <div className="max-w-7xl mx-auto p-8">

            <h2 className="text-3xl font-bold mb-8">

              Search Results

            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

              {movies.map((movie) => (

                <MovieCard

                  key={movie.id}

                  movie={movie}

                />

              ))}

            </div>

          </div>

        ) : (

          <>

            {/* HERO */}

            {heroMovie && (

              <div className="relative h-[650px] overflow-hidden">

                <img

                  src={

                    heroMovie.poster ||

                    "https://placehold.co/1400x700"

                  }

                  alt={heroMovie.title}

                  className="w-full h-full object-cover"

                />

                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="absolute bottom-20 left-16 max-w-2xl">

                  <div className="mb-6">
                    <h2 className="text-3xl font-semibold text-gray-200">
                    Welcome back, {username} 👋
                    </h2>

                    <p className="text-gray-400 mt-2">
                    Here are your personalized recommendations.
                    </p>
                  </div>

                  <h1 className="text-6xl font-bold mb-4">

                    {heroMovie.title}

                  </h1>

                  <p className="text-xl text-gray-300 mb-6">

                    AI-powered recommendations
                    generated using machine learning.

                  </p>

                  <Link
                    to={`/movie/${heroMovie.id || heroMovie.movieId}`}
                    className="bg-white text-black px-8 py-3 rounded-lg font-semibold"
                  >
                    Watch Details
                  </Link>

                </div>

              </div>

            )}

            {/* SECTIONS */}

            <MovieRow

              title="Recommended For You"

              subtitle="Based on users with similar tastes"

              movies={recommendations}

            />

            <MovieRow

              title="Top Rated Movies"

              subtitle="Highest rated across the platform"

              movies={topRated}

            />

            <MovieRow
              title="Action Movies"
              movies={actionMovies}
            />

            <MovieRow
              title="Comedy Movies"
              movies={comedyMovies}
            />

            <MovieRow
              title="Drama Movies"
              movies={dramaMovies}
            />

            <MovieRow
              title="Sci-Fi Movies"
              movies={sciFiMovies}
            />

            <MovieRow
              title="Thriller Movies"
              movies={thrillerMovies}
            />

          </>

        )}

      </div>

    </>

  );
}

function MovieRow({
  title,
  movies,
}) {
  return (
    <div className="mb-12 px-8">
      <h2 className="text-white text-3xl font-bold mb-4">
        {title}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {movies.map((movie) => (
          <div
            key={
              movie.id || movie.movieId
            }
            className="min-w-[220px]"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}