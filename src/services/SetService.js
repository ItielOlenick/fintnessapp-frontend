import httpClient from "../http-common";

const get = (user) => {
  return httpClient.get("/sets", { params: { userId: user } });
};
const getPrs = (user) => {
  return httpClient.get("/prs", { params: { userId: user } });
};

const getByName = (user, name) => {
  return httpClient.get("/sets", { params: { userId: user, name: name } });
};
export default { get, getPrs };
