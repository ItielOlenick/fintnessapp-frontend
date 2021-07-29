import { useEffect, useState } from "react";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";



const AddWorkout = () => {

    const [listexercises, Getexercises] = useState([]);

    useEffect (() => {
        ExercisesService.getAll()
        .then(response => {
            console.log("printing response", response.data);
            Getexercises(response.data);
        })
        .catch(error => {
            console.log("Error - somthing is wrong", error);
        })
    }, []);

    var options=[];
    listexercises.length > 0 ? options = listexercises : console.log("loading");

    const [name, setName] = useState("");
    const [exercises, setExercises] = useState([]);
    const [selectExersice, getExercise] = useState("");
    const [sets, setSets] = useState([]);
    const [selectSets, getSets] = useState("");
    
    
    const addExercise = (e) => {
        e.preventDefault();
        setExercises(exercises => [...exercises ,selectExersice]);
        addSet(e);
    };

    const addSet = (e) => {
        e.preventDefault();
        setSets(sets => [...sets ,selectSets])
    };


    const saveWorkout = (e) => {
        
        //final Exercises mapping
/*         const finalExercises = exercises.map((value, index) => {
            return {
                name: value,
                sets: sets[index]
            }
        })
        ; */
        console.log("exercises",exercises);

        const finalSets = [];
        
        for (let i = 0; i < exercises.length; i++) {
            for (let j = 0; j < sets[i]; j++) {
                finalSets.push(
                    {
                        name: exercises[i]
                    }
                );
            }
        };
        console.log("final sets",finalSets);
        

        e.preventDefault();
        const workout = {name, sets: finalSets};
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
                        onChange={(e) => setName(e.target.value)}
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
                            className="form-control" 
                            id="exercises"
                            value={options[0]}
                            onInput={(e) => getExercise(e.target.value)}
                            >
                                {options.map((options) => (
                                    <option key={options.id} value={options.name}>
                                        {options.name}
                                </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="sets">Sets:</label>
                        <input type="number" className="form-control" id="sets" 
                        onInput={(e) => getSets(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="text-center mb-3">
                    <button
                    onClick={(e) => (addExercise(e))}
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