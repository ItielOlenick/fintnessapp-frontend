import { useState } from "react";
import ExercisesService from "../services/ExercisesService";

const AddExercise = () => {
    
    const [name, setName] = useState("");
    const [bodyPart, setBodyPart] = useState("");

    const saveExercise = (e) =>{
        e.preventDefault();
        const exercise = {name, bodyPart};
        ExercisesService.create(exercise)
        .then(response => {
            console.log("exercise added successfuly", response.data);
        })
        .catch(error => {
            console.log("Somthing went wrond", error);
        })
    };
    
    return ( 
        <div className="create">
            <form>
                <div className="form-group mb-3">
                <label htmlFor="name">Exercise name: <sup>*</sup></label>
                <input 
                        type="text"
                        className="form-control" 
                        id="title"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                <label htmlFor="name">Body part: <sup>*</sup></label>
                <input 
                        type="text"
                        className="form-control" 
                        id="bodyPart"
                        onChange={(e) => setBodyPart(e.target.value)}
                    />
                </div>
                <div className="text-center mb-3">
                    <button
                    onClick={(e) => (saveExercise(e))}
                    >Add exercise</button>
                </div>
            </form>
        </div>
     );
}
 
export default AddExercise;