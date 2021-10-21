import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import NoteFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import WorkoutList from "./components/WorkoutList";
import ExercisesList from "./components/ExercisesList";
import AddWorkout from "./components/AddWorkout";
import AddExercise from "./components/AddExercise";
import EditWorkout from "./components/EditWorkout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./services/firebase";
import Home from "./components/Home";
import { Content } from "antd/lib/layout/layout";
import { Spin, Col, Row, Drawer, Modal, Button, notification } from "antd";
import AddLog from "./components/AddLog";
import LogList from "./components/LogList";
import ViewLog from "./components/ViewLog";
import { useState } from "react";
import axios from "axios";
import version from "./version";
import UserPanel from "./components/Auth/UserPanel";
import Progress from "./components/Progress";
import About from "./components/About";

function App() {
  const [user, loading] = useAuthState(auth);

  //active workout
  const [logCount, setLogCount] = useState(0);
  //initiate new workout
  const start = ({ id, edit, empty, samples }) => {
    setWorkoutProps({
      id: id,
      edit: edit,
      empty: empty,
      samples: samples,
    });
    if (active) {
      showModal();
    } else {
      setActive(true);
      showDrawer();
    }
  };

  const [active, setActive] = useState();
  const [workoutProps, setWorkoutProps] = useState({
    edit: false,
    id: null,
    empty: true,
    samples: null,
  });
  //drawer
  const [visible, setVisible] = useState(false);

  const done = () => {
    setActive(false);
    onClose();
    setLogCount(logCount === 0 ? 1 : 0);
  };

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => {
    setModalVisible(true);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleOk = () => {
    setActive(false);
    setModalVisible(false);
    start({ ...workoutProps });
  };

  return (
    <BrowserRouter>
      <p className="onComputer">
        This webapp was designed for mobile devices 📱.
        <br /> To use this app properly please access and/or install it from
        your mobile device.
        <br />
        Meanwhile, you can enjoy this simulation
      </p>

      <div className="mobile-sim" style={{ width: 375, height: 720 }}>
        <iframe
          src="https://fintnessapp-frontend.herokuapp.com"
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      </div>
      <div className="show">
        <Navbar showDrawer={showDrawer} />
        <Row justify="center" style={{ paddingBottom: 50 }}>
          <Col sm={12} xs={24}>
            <Content className="main-content">
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spin tip="Loading..." />
                </div>
              ) : user ? (
                <>
                  <Switch>
                    <Route exact path="/progress" component={Progress} />
                    <Route
                      exact
                      path={["/", "/index.html", "/register"]}
                      render={(props) => (
                        <WorkoutList {...props} start={start} />
                      )}
                    />
                    <Route
                      exact
                      path="/logList"
                      render={(props) => (
                        <LogList {...props} start={start} logCount={logCount} />
                      )}
                    />
                    <Route exact path="/viewLog" component={ViewLog} />
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

                    <Route exact path="/logWorkout/" component={AddLog} />
                    <Route exact path="/exercises" component={ExercisesList} />
                    <Route exact path="/addExercise" component={AddExercise} />
                    <Route exact path="/userPanel" component={UserPanel} />
                    <Route path="*" component={NoteFound} />
                  </Switch>
                </>
              ) : (
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Redirect exact from="/home" to="/" />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/about" component={About} />
                  <Route path="*" component={NoteFound} />
                </Switch>
              )}
            </Content>
          </Col>
        </Row>
      </div>

      {user ? (
        <>
          {active ? (
            <Button
              className="workout-in-progress"
              style={{
                bottom: 60,
                position: "fixed",
                width: "100%",
                justifyContent: "center",
              }}
              danger
              onClick={() => {
                showDrawer();
              }}
            >
              Workout in progress
            </Button>
          ) : (
            <></>
          )}
          {active ? (
            <Drawer
              contentWrapperStyle={visible ? { bottom: 60 } : {}}
              placement="bottom"
              visible={visible}
              onClose={onClose}
              height={visible ? "calc(100% - 60px)" : "100%"}
              closable={false}
            >
              <AddLog
                done={done}
                location={{
                  state: {
                    empty: workoutProps.empty,
                    edit: workoutProps.edit,
                    id: workoutProps.id,
                    samples: workoutProps.samples,
                  },
                }}
              />
            </Drawer>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <Modal
        zIndex={2000}
        title={"Workout in progress"}
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        // destroyOnClose={true}
        // footer={null}
      >
        You have an active workout session. are you sure you want to terminate
        it and start a new one?
      </Modal>
    </BrowserRouter>
  );
}

export default App;
