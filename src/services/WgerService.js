import axios from "axios";

const wgerService = axios.create({
  baseURL: "https://wger.de/api/v2",
});

const getExercise = (category) => {
  return wgerService.get("/exercise", { params: { category: { category } } });
};

export default { getExercise };
