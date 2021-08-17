import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";

const ExercisesList = () => {
  const [exercises, SetExercises] = useState([]);
  const [user] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    user
      ? ExercisesService.getAll(user.uid)
          .then((response) => {
            console.log("printing response", response.data);
            SetExercises(response.data);
          })
          .catch((error) => {
            console.log("Error - somthing is wrong", error);
          })
      : SetExercises([]);
  }, [user]);

  const handleDelete = (id, i) => {
    ExercisesService.remove(id)
      .then((response) => {
        history.push("/exercises/reload");
      })
      .catch((error) => {
        console.log("Somthing is wrong", error);
      });
  };

  return (
    <div className="main-content container">
      <h4>List of exercises</h4>
      <div className="notes-list mt-4 container">
        {exercises.length > 0 ? (
          exercises.map((exercise, i) => (
            <div key={exercise.id} className="notes-preview mt-3 row">
              <div className="col">
                <Link to="#" className="link">
                  <h5 className="primary-color text-capitalize">
                    {exercise.name}
                  </h5>
                  <p>{exercise.bodyPart}</p>
                </Link>
              </div>
              <div className="col-3" key={i}>
                <button onClick={() => handleDelete(exercise.id, i)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No exercises available</div>
        )}
      </div>
    </div>
  );
};

export default ExercisesList;
