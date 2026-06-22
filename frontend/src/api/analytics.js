import api from "./axios";

export const getPlatformAnalytics = async () => {
  const { data } = await api.get(
    "/analytics/platform"
  );

  return data;
};

export const getUserAnalytics = async () => {
  const { data } = await api.get(
    "/analytics/me"
  );

  return data;
};