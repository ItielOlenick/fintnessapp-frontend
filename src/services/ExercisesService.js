import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get("/exercises");
}

const create = data => {
    return httpClient.post("/exercises", data);
}
export default { getAll, create }