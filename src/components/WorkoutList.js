import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";

const WorkoutList = () => {
  const [user] = useAuthState(auth);
  const [workouts, SetWorkouts] = useState([]);

  useEffect(() => {
    user
      ? WorkoutService.getAll(user.uid)
          .then((response) => {
            console.log("printing response", response.data);
            SetWorkouts(response.data);
          })
          .catch((error) => {
            console.log("Error - something is wrong", error);
          })
      : SetWorkouts([]);
  }, [user]);

  return (
    <div className="main-content container">
      <h4>List of workouts</h4>
      <div className="notes-list mt-4">
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div key={workout.id} className="notes-preview mt-3">
              <Link to={`/workouts/${workout.id}`} className="link">
                <h5 className="primary-color text-capitalize">
                  {workout.name}
                </h5>
                <div>
                  <p>Total sets: {workout.sets.length}</p>
                </div>
                {/* <div className="row">
                                <div className="col">
                                    <p>exercises: </p>
                                    <ol>
                                        {workout.sets.map((item, b) => (
                                        <li key={b}>{item.name}</li>
                                        ))}
                                    </ol>
                                </div>
                                <div className="col">
                                    <p>Reps: </p>
                                    <ol>
                                        {workout.sets.map((item, b) => (
                                        <ul key={b}>{item.reps}</ul>
                                        ))}
                                    </ol>
                                </div>
                            </div> */}
              </Link>
            </div>
          ))
        ) : (
          <div>No workouts created yet.</div>
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
