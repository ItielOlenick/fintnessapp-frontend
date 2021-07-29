import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get("/exercises");
}

const create = data => {
    return httpClient.post("/exercises", data);
}

const remove = id => {
    return httpClient.delete(`/exercises/${id}`);
}
export default { getAll, create, remove }