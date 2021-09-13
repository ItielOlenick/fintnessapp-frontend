import httpClient from "../http-common";

const getAll = (user) => {
  return httpClient.get("/logs", { params: { user: user } });
};

const create = (data) => {
  return httpClient.post("/logs", data);
};

const get = (id) => {
  return httpClient.get(`/logs/${id}`);
};

const remove = (id) => {
  return httpClient.delete(`/logs/${id}`);
};

const update = (data) => {
  return httpClient.put("/logs", data);
};
export default { getAll, create, get, remove, update };
