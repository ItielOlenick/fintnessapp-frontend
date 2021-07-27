import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get("/workouts");
}
 

const create = data => {
    return httpClient.post("/workouts", data);
}
export default { getAll, create }; 