import { useState } from "react";
import ExercisesService from "../services/ExercisesService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { message } from "antd";

const AddExercise = () => {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [bodyPart, setBodyPart] = useState("");

  const saveExercise = (e) => {
    e.preventDefault();
    const exercise = { name, bodyPart, owner: user.uid };
    ExercisesService.create(exercise)
      .then((response) => {
        message.info("exercise added successfully");
        setName("");
        setBodyPart("");
      })
      .catch((error) => {
        console.log("Something went wrong", error);
      });
  };

  return (
    <div className="create container">
      <form>
        <div className="form-group mb-3">
          <label htmlFor="name">
            Exercise name: <sup>*</sup>
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="name">
            Body part: <sup>*</sup>
          </label>
          <input
            type="text"
            className="form-control"
            id="bodyPart"
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
          />
        </div>
        <div className="text-center mb-3">
          <button onClick={(e) => saveExercise(e)}>Add exercise</button>
        </div>
      </form>
    </div>
  );
};

export default AddExercise;
