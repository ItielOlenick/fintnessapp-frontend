import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import WorkoutService from "../services/WorkoutService";

const WorkoutList = () =>{
    
    const [workouts, SetWorkouts] = useState([]);

useEffect (() => {
    WorkoutService.getAll()
    .then(response => {
        console.log("printing response", response.data);
        SetWorkouts(response.data);
    })
    .catch(error => {
        console.log("Error - somthing is wrong", error);
    })
}, []);

    return (
        <div className="main-content">
            <h4>List of workouts</h4>
            <div className="notes-list mt-4">
            {
                workouts.length > 0 ? workouts.map(workout =>(
                    <div key = {workout.id} className="notes-preview mt-3">
                        <Link to="#" className="link">
                            <h5 className="primary-color text-capitalize">{workout.name}</h5>
                            <p>{workout.exercises} exercises</p>
                        </Link>
                    </div>
                )) : <div>No workouts created yet.</div>
            }
            </div>
        </div>
    );

}

export default WorkoutList;