import httpClient from "../http-common";

const getAll = () => {
    httpClient.get("/users");
}

export default { getAll }