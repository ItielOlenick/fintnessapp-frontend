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

const remove = id => {
    return httpClient.delete(`/workouts/${id}`);
}

const update = data => {
    return httpClient.put("/workouts", data);
}
export default { getAll, create, get, remove, update }; 