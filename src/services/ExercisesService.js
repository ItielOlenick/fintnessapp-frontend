import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get("/exercises");
}

export default { getAll }