import { Link } from "react-router-dom"
const Navbar = () => {
    return (
        <div className="container-fluid">
        <nav className = "navbar navbar-expand-lg navbar-light">
            <h2 className="primary-color">Fitness App</h2>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse flex-row-reverse" id="topNavbar">
                <div><Link to="/" className="ms-3 link">Home</Link></div>
                <div><Link to="/exercises" className="ms-3 link">Exercises</Link></div>
                <div><Link to="/addExercise" className="ms-3 link">Add Exercise</Link></div>
                <div><Link to="/addWorkout" className="ms-3 link">New Workout</Link></div>
                <div><Link to="#" className="ms-3 link">About</Link></div>
            </div>
        </nav>
        </div> 
     );
}
 
export default Navbar;