import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import WorkoutService from "../services/WorkoutService";

const WorkoutList = () =>{
    
    const [workout, SetWorkouts] = useState("");
    const {id} = useParams();
    const history = useHistory();
    useEffect (() => {
        WorkoutService.get(id)
        .then(response => {
            console.log("printing response", response.data);
            SetWorkouts(response.data);
        })
        .catch(error => {
            console.log("Error - somthing is wrong", error);
        })
    }, []);

    const handleDelete = () => {
        WorkoutService.remove(id)
        .then(response => {
            history.push("/");
        })
        .catch(error => {
            console.log("Somthing is wrong", error);
        })
    }

    const handleEdit = () => {
        history.push(`/workouts/edit/${id}`)
    }

    return (
        <div className="main-content note-details container">
            
            <div className="notes-list mt-4">
            {
                workout !== "" ? (
                    <div key = {workout.id} className="notes-preview mt-3">
                        <h5 className="primary-color text-capitalize">{workout.name}</h5>
                            <div>
                                <p>Total sets: {workout.sets.length}</p>
                            </div>
                            
                            <div className="samerow">
                                <p><b>exercises: </b></p>
                                <p><b>Reps:</b></p>
                            </div>
                            <div>
                                    <ol>
                                        {workout.sets.map((item, b) => (
                                        <div className="samerow">
                                            <li key={b}>{item.name}</li>
                                            <ul key={b*2+1}>{item.reps}</ul>
                                        </div>
                                        ))}
                                    </ol>
                            </div>
                            <div>
                                <button onClick={handleDelete}>Delete</button>
                                <button onClick={handleEdit} className="ms-3">Edit</button>
                            </div>
                    </div>
                   ) : <div>No workouts created yet.</div>
                   
            }
            </div>

        </div>
    );

}

export default WorkoutList;


