import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get("/workouts");
}
 

const create = data => {
    return httpClient.post("/workouts", data);
}

const get = id => {
    return httpClient.get(`/workouts/${id}`);
}
export default { getAll, create, get }; 