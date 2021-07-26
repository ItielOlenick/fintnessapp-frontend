import axios from "axios";

export default axios.create(
    {
        //dev----> baseURL: "http://localhost:8080/api",
        baseURL: "https://fintnessapp-backend.herokuapp.com/api",
        headers: {
            "Content-type": "application/json"
        }
    }
)