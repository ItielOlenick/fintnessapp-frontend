import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get("/sets");
}

const create = data => {
    return httpClient.post("/sets", data);
}

export default { getAll, create };