import { Link } from "react-router-dom"

const Navbar = () => {
    return ( 
        <nav className = "navbar">
            <h2 className="primary-color">Fitness App</h2>
            <div>
                <Link to="/" className="ms-3 link">Home</Link>
                <Link to="#" className="ms-3 link">My Workouts</Link>
                <Link to="#" className="ms-3 link">New Workout</Link>
                <Link to="#" className="ms-3 link">About</Link>
            </div>
        </nav>
     );
}
 
export default Navbar;