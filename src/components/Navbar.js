import { Link, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const history = useHistory();
  const logout = () => {
    auth.signOut().then(history.push("/home"));
  };

  return (
    <div className="container-fluid">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {user ? (
          <div className="sameRow">
            <p>
              {
                (user.displayName,
                user.displayName ? user.displayName : user.email)
              }
            </p>
            <Link onClick={logout} className="ms-3 link">
              Logout
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
      <nav className="navbar navbar-expand-lg navbar-light">
        <h2 className="primary-color">Fitness App</h2>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse  justify-content-end"
          id="topNavbar"
        >
          <div>
            <Link to="/" className="ms-3 link">
              Home
            </Link>
          </div>
          {user ? (
            <>
              <div>
                <Link to="/exercises" className="ms-3 link">
                  Exercises
                </Link>
              </div>
              <div>
                <Link to="/addExercise" className="ms-3 link">
                  Add Exercise
                </Link>
              </div>
              <div>
                <Link to="/addWorkout" className="ms-3 link">
                  New Workout
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}
          <div>
            <Link to="#" className="ms-3 link">
              About
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
