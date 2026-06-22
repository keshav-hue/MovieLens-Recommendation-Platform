import api from "./axios";

export const rateMovie = async (movieId, rating) => {
  const { data } = await api.post("/ratings", {
    movieId,
    rating,
  });

  return data;
};

export const getMyRatings = async () => {
  const { data } = await api.get("/ratings/me");
  return data;
};

export const deleteRating = async (movieId) => {
  const { data } = await api.delete(
    `/ratings/${movieId}`
  );

  return data;
};