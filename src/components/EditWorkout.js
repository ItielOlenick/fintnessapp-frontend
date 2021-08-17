import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";

const EditWorkout = () => {
  const [listexercises, Getexercises] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    user
      ? ExercisesService.getAll(user.uid)
          .then((response) => {
            console.log("printing response", response.data);
            Getexercises(response.data);
          })
          .catch((error) => {
            console.log("Error - somthing is wrong", error);
          })
      : Getexercises([]);
  }, [user]);

  var options = [];
  listexercises.length > 0 ? (options = listexercises) : console.log("loading");

  const [sets, setSets] = useState([]);
  const [name, setName] = useState("");
  const { id } = useParams();
  const [selectExersice, getExercise] = useState({});
  const history = useHistory();

  useEffect(() => {
    WorkoutService.get(id)
      .then((workout) => {
        setName(workout.data.name);
        setSets(workout.data.sets);
        console.log("found id");
      })
      .catch((error) => {
        console.log("Somthing is wrong", error);
      });
  }, []);

  const updateReps = (e, index) => {
    e.preventDefault();
    var update = sets;
    update[index].reps = e.target.value;
    //arrays are in the same state since the items changed but the array itself didnt. so we
    //spread the array itself again to show react we have changed it.
    setSets([...update]);
  };
  const removeExercise = (e, index) => {
    e.preventDefault();
    if (sets.length > 1) {
      var update = sets;
      update.splice(index, 1);
      console.log(update);
      setSets([...update]);
    } else console.log("remove the workout");
  };

  const addExercise = (e) => {
    e.preventDefault();
    console.log(selectExersice);
    getExercise((selectExersice.reps = 0));
    setSets((sets) => [...sets, selectExersice]);
    getExercise(selectExersice);
  };

  const saveWorkout = (e) => {
    e.preventDefault();
    const workout = { id, name, sets };
    console.log("workout:", workout);
    WorkoutService.update(workout)
      .then((response) => {
        console.log("Workout added successfully", response.data);
        history.push(`/workouts/${response.data.id}`);
      })
      .catch((error) => {
        console.log("Somthing went wrong");
      });
  };

  return (
    <div className="main-content container">
      {sets.length > 0 ? (
        <form>
          <div className="form-group mb-3">
            <label htmlFor="title">
              Workout Title: <sup>*</sup>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="samerow">
            <h5>exercises:</h5>
            <label htmlFor="reps" className="mobile">
              <h5> Reps:</h5>
            </label>
          </div>
          <div>
            <ol>
              {sets.map((item, b) => (
                <div className="samerow" style={{ marginBottom: 5 }}>
                  <li key={b}>{item.name}</li>
                  <div className="col-4 samerow">
                    <input
                      type="number"
                      className="form-control mobile-textbox"
                      id="reps"
                      value={item.reps}
                      onInput={(e) => updateReps(e, b)}
                    />
                    <button
                      className="mobile-btn"
                      onClick={(e) => removeExercise(e, b)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </ol>
          </div>
          <div className="form-group mb-3 create">
            <h5>Add exercises:</h5>
            <label htmlFor="exercises">Select exercises to add</label>
            <select
              className="form-control"
              id="exercises"
              defaultValue=""
              //another option: onInput={(e) => getExercise(JSON.parse(e.target.value))}
              onInput={(e) => getExercise(options[e.target.value])}
            >
              <option value="" hidden>
                chose exercise
              </option>
              {options.map((options, index) => (
                //another option: <option key={options.id} value={JSON.stringify({name: options.name, bodyPart: options.bodyPart})}>
                <option key={options.id} value={index}>
                  {options.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center mb-3">
            <button onClick={(e) => addExercise(e)}>Add exercise</button>
          </div>

          <div className="text-center mb-3">
            <button onClick={(e) => saveWorkout(e)}>Save Workout</button>
          </div>
        </form>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default EditWorkout;
