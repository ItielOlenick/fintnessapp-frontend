import './App.css';
import UsersList from './components/UsersList';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NoteFound from './components/NotFound';
import Navbar from './components/Navbar';
import WorkoutList from './components/WorkoutList';
import ExercisesList from './components/ExercisesList';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar/>
        <div>
          <Switch>
            <Route exact path = "/" component={WorkoutList} />
            <Route exact path = "/exercises" component={ExercisesList} />
            <Route path="*" component={NoteFound} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
