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
import { Content } from "antd/lib/layout/layout";
import { Col, Row, Spin } from "antd";
import AddLog from "./components/AddLog";
import LogList from "./components/LogList";
import { useState } from "react";
import { useEffect } from "react";
function App() {
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) setLoading(false);
    else setLoading(false);
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar />
      <Row justify="center" style={{ paddingBottom: 30 }}>
        <Col sm={12} xs={24}>
          <Content className="main-content">
            {loading ? (
              <></>
            ) : user ? (
              <>
                <Switch>
                  <Route exact path="/" component={WorkoutList} />
                  <Route exact path="/logList" component={LogList} />
                  <Route exact path="/addWorkout" component={AddWorkout} />
                  <Route
                    exact
                    path="/Workouts/edit/:id"
                    component={EditWorkout}
                  />
                  <Route exact path="/logs/edit" component={AddLog} />
                  <Route
                    exact
                    path="/addWorkoutFromLog"
                    component={EditWorkout}
                  />
                  <Route exact path="/workouts/:id" component={ViewWorkout} />
                  <Route exact path="/logWorkout/" component={AddLog} />
                  <Route exact path="/exercises" component={ExercisesList} />
                  <Route exact path="/addExercise" component={AddExercise} />
                  <Redirect exact from="/exercises/reload" to="/exercises" />
                  <Route path="*" component={NoteFound} />
                </Switch>
              </>
            ) : (
              <Switch>
                <Route exact path="/" component={Home} />
                <Redirect exact from="/home" to="/" />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route path="*" component={NoteFound} />
              </Switch>
            )}
          </Content>
        </Col>
      </Row>
    </BrowserRouter>
  );
}

export default App;
