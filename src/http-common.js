import axios from "axios";

export default axios.create({
  //dev
  // baseURL: "http://localhost:8080/api",

  //for mobile purposes
  // baseURL: "http://192.168.1.174:8080/api",

  // baseURL: "http://10.0.0.22:8080/api",

  // production
  baseURL: "https://fintnessapp-backend.herokuapp.com/api",
  headers: {
    "Content-type": "application/json",
  },
});
