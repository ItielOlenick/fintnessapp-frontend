import httpClient from "../http-common";

const getAll = (user) => {
  return httpClient.get("/exercises", { params: { owner: user } });
};

const get = (id) => {
  return httpClient.get(`/exercises/${id}`);
};

const create = (data) => {
  return httpClient.post("/exercises", data);
};

const update = (data) => {
  return httpClient.put("/exercises", data);
};

const remove = (id) => {
  return httpClient.delete(`/exercises/${id}`);
};
export default { getAll, create, remove, update, get };
