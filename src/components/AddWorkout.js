import { useRef, useState } from "react";
import WorkoutService from "../services/WorkoutService";

const AddWorkout = () => {

    const [name, setTitle] = useState("");
    const [exercises, setExercises] = useState([]);
    const inputExercises = useRef();
    const inputSets = useRef();
    const [sets, setSets] = useState([]);

    var addToList = e => {
        e.preventDefault();
        setExercises([...exercises, inputExercises.current.value]);
        setSets([...sets, inputSets.current.value]);
    };
    
    const saveWorkout = (e) => {
        e.preventDefault();
        const workout = {name, exercises, sets};
        console.log("",workout);
        WorkoutService.create(workout)
        .then(response => {
            console.log("Workout added successfully", response.data);
        })
        .catch(error => {
            console.log("Somthing went wrong");
        })
    };

    return ( 
        <div className="create">
            <form>

                <div className="form-group mb-3">

                    <label htmlFor="title">Workout Title: <sup>*</sup></label>
                    <input 
                        type="text"
                        className="form-control" 
                        id="title"
                        //value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                </div>
                <div className="row">
                    <div className="col">
                        <h5>Exercises:</h5>
                        <ul>
                            {exercises.map((item, b) => (
                                <li key={b}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="col">
                    <h5>Sets:</h5>
                        <ul>
                        {sets.map((item, b) => (
                                <li key={b}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group mb-3">
                            <label htmlFor="exercises">Select exercises</label>
                            <select 
                            ref={inputExercises}
                            className="form-control" 
                            id="exercises" 
                            //value={exercises}
                            //onChange={(e) => setExercises(e.target.value)}
                            >
                                <option value="Bench Press">Bench Press</option>
                                <option value="Dumbell row">Dumbell row</option>
                                <option value="Tricep extention">Tricep extention</option>
                                <option value="Bicep curl">Bicep curl</option>
                                <option value="Squat">Squat</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="sets">Sets:</label>
                        <input type="number" className="form-control" id="sets" ref={inputSets} />
                    </div>
                </div>
                
                <div className="text-center mb-3">
                    <button
                    onClick={addToList}
                    >Add exercise</button>
                </div>

                <div className="text-center mb-3">
                    <button
                    onClick={(e) => saveWorkout(e)}
                    >Save Workout</button>
                </div>
            </form>
        </div>
     );
}
 
export default AddWorkout;