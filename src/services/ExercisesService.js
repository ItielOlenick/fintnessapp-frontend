import httpClient from "../http-common";

const getAll = (user) => {
  return httpClient.get("/exercises", { params: { owner: user } });
};

const create = (data) => {
  return httpClient.post("/exercises", data);
};

const remove = (id) => {
  return httpClient.delete(`/exercises/${id}`);
};
export default { getAll, create, remove };
