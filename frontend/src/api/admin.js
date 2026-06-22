import api from "./axios";

export const fetchPosters = async (
  limit = 50
) => {
  const { data } = await api.post(
    "/admin/fetch-posters",
    { limit }
  );

  return data;
};