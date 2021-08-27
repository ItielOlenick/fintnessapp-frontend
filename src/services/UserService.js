import httpClient from "../http-common";

const create = (data) => {
  return httpClient.post("/users", data);
};

const get = (id) => {
  return httpClient.get("/users", { params: { user: id } });
};

const update = (data) => {
  return httpClient.put("/users", data);
};
export default { create, get, update };
