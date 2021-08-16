import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import NoteFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import WorkoutList from "./components/WorkoutList";
import ExercisesList from "./components/ExercisesList";
import AddWorkout from "./components/AddWorkout";
import AddExercise from "./components/AddExercise";
import ViewWorkout from "./components/ViewWorkout";
import EditWorkout from "./components/EditWorkout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./services/firebase";
import Home from "./components/Home";

function App() {
  const [user] = useAuthState(auth);
  return (
    <BrowserRouter>
      <div>
        <Navbar />
      </div>
      {user ? (
        <div>
          <Switch>
            <Route exact path="/" component={WorkoutList} />
            <Route exact path="/addWorkout" component={AddWorkout} />
            <Route exact path="/Workouts/edit/:id" component={EditWorkout} />
            <Route exact path="/workouts/:id" component={ViewWorkout} />
            <Route exact path="/exercises" component={ExercisesList} />
            <Route exact path="/addExercise" component={AddExercise} />
            <Route path="*" component={NoteFound} />

            <Redirect exact from="/exercises/reload" to="/exercises" />
            <Route path="*" component={NoteFound} />
          </Switch>
        </div>
      ) : (
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Redirect exact from="/home" to="/" />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="*" component={NoteFound} />
          </Switch>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
