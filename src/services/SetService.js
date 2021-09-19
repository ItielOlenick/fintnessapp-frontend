import httpClient from "../http-common";

const get = (user) => {
  return httpClient.get("/sets", { params: { userId: user } });
};

const getPrsByName = (user, exercise, all) => {
  return httpClient.get(`/prs`, {
    params: { userId: user, exercise: exercise, all: all },
  });
};
export default { get, getPrsByName };
