import httpClient from "../http-common";

const getExercise = (category) => {
  return httpClient.get("/wgerexercises", {
    params: { category: category },
  });
};

const getCategories = () => {
  return httpClient.get("/categories");
};

export default { getExercise, getCategories };
