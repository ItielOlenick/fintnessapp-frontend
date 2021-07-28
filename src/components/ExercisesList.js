import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";


const ExercisesList = () =>{
    
    const [exercises, SetExercises] = useState([]);

useEffect (() => {
    ExercisesService.getAll()
    .then(response => {
        console.log("printing response", response.data);
        SetExercises(response.data);
    })
    .catch(error => {
        console.log("Error - somthing is wrong", error);
    })
}, []);

    return (
        <div className="main-content">
            <h4>List of exercises</h4>
            <div className="notes-list mt-4">
            {
                exercises.length > 0 ? exercises.map(exercise =>(
                    <div key = {exercise.id} className="notes-preview mt-3">
                        <Link to="#" className="link">
                            <h5 className="primary-color text-capitalize">{exercise.name}</h5>
                            <p>{exercise.bodyPart}</p>
                        </Link>
                    </div>
                )) : <div>No exercises available</div>
            }
            </div>
        </div>
    );

}

export default ExercisesList;