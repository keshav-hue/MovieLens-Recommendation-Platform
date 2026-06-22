import api from "./axios";

export const getMLRecommendations =
  async () => {
    const { data } = await api.get(
      "/recommendations/ml"
    );

    return data;
  };

export const getRecommendations =
  async () => {
    const { data } = await api.get(
      "/recommendations/me"
    );

    return data;
  };