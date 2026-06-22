import { useState } from "react";

export default function StarRating({
  movieId,
  onRate,
}) {
  const [selected, setSelected] =
    useState(0);

  const handleClick = (value) => {
    setSelected(value);

    if (onRate) {
      onRate(movieId, value);
    }
  };

  return (
    <div className="flex gap-2 text-4xl">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer ${
            star <= selected
              ? "text-yellow-500"
              : "text-gray-300"
          }`}
          onClick={() =>
            handleClick(star)
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}