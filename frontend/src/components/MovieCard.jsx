import { useNavigate } from "react-router-dom";

export default function MovieCard({
  movie,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(
          `/movie/${
            movie.id || movie.movieId
          }`
        )
      }
      className="group cursor-pointer"
    >
      <div className="overflow-hidden rounded-xl">
        <img
          src={
            movie.poster ||
            "https://placehold.co/300x450?text=MovieLens"
          }
          alt={movie.title}
          className="w-full h-80 object-cover transition duration-300 group-hover:scale-110"
        />
      </div>

      <h3 className="text-white mt-3 font-semibold">
        {movie.title}
      </h3>
    </div>
  );
}