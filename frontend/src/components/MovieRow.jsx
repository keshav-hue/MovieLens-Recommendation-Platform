function MovieRow({
  title,
  subtitle,
  movies,
}) {
  return (
    <div className="mb-14 px-8">

      <h2 className="text-3xl font-bold text-white">
        {title}
      </h2>

      <p className="text-gray-400 mb-4">
        {subtitle}
      </p>

      <div
        className="
          flex
          gap-5
          overflow-x-auto
          pb-4
          scrollbar-hide
        "
      >
        {movies.map((movie) => (
          <div
            key={
              movie.id || movie.movieId
            }
            className="
              min-w-[220px]
              transition
              duration-300
              hover:scale-105
            "
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}