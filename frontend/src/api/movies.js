import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getMovies = async (page = 1) => {
  const response = await axios.get(
    `${API}/movies?page=${page}&limit=20`
  );

  return response.data;
};

export const searchMovies = async (query) => {
  const response = await axios.get(
    `${API}/movies/search?q=${query}`
  );

  return response.data;
};

export const getMovieById = async (id) => {
  const response = await axios.get(
    `${API}/movies/${id}`
  );

  return response.data;
};

export const getTopRatedMovies = async () => {
  const response = await axios.get(
    `${API}/movies/top-rated`
  );

  return response.data;
};

export const getGenres = async () => {
  const response = await axios.get(
    `${API}/movies/genres`
  );

  return response.data;
};

export const getMoviesByGenre = async (
  genre
) => {
  const response = await axios.get(
    `${API}/movies/genre/${genre}`
  );

  return response.data;
};