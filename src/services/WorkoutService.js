import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get("/workouts")
}
 
export default { getAll }