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
import { Col, Row, Drawer, Modal, Button, notification } from "antd";
import AddLog from "./components/AddLog";
import LogList from "./components/LogList";
import ViewLog from "./components/ViewLog";
import { useState } from "react";
import axios from "axios";
import version from "./version";
function App() {
  const [user] = useAuthState(auth);

  //active workout

  //initiate new workout
  const start = ({ id, edit, empty }, force) => {
    setWorkoutProps({ ...workoutProps, id: id, edit: edit, empty: empty });
    if (active && !force) {
      showModal();
    } else {
      showDrawer();
      setActive(true);
    }
  };

  const [active, setActive] = useState();
  const [workoutProps, setWorkoutProps] = useState({
    edit: false,
    id: null,
    empty: true,
  });
  //drawer
  const [visible, setVisible] = useState(false);

  const done = () => {
    setActive(false);
    onClose();
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
    start({ ...workoutProps }, true);
  };

  const [currVer, setCurrVer] = useState();

  const check = setInterval(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/ItielOlenick/fintnessapp-frontend/antd-and-remake-the-concept/src/version.js"
      )
      .then((data) => {
        const latest = data.data.match(/\d/g).join("");
        const current = version.toString().match(/\d/g).join("");
        if (latest !== current) {
          console.log("latest version: ", latest, "current version: ", current);
          openNotification();
          clearInterval(check);
        }
        console.log("up to date");
        console.log("latest version: ", latest, "current version: ", current);
      });
  }, 10000);

  const openNotification = () => {
    const msg = (
      <>
        Click{" "}
        <a
          onClick={() => {
            window.location.reload();
          }}
        >
          here
        </a>{" "}
        to update now
      </>
    );
    const args = {
      key: "update",
      message: "Update Available",
      description: msg,
      duration: 0,
    };
    notification.open(args);
  };

  return (
    <BrowserRouter>
      <Navbar showDrawer={showDrawer} />
      <Row justify="center" style={{ paddingBottom: 50 }}>
        <Col sm={12} xs={24}>
          <Content className="main-content">
            {user ? (
              <>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={(props) => <WorkoutList {...props} start={start} />}
                  />
                  <Route
                    exact
                    path="/logList"
                    render={(props) => <LogList {...props} start={start} />}
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
                  {/* <Redirect exact from="/exercises/reload" to="/exercises" /> */}
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
      {active ? (
        <div>
          <Button
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
        </div>
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
              },
            }}
          />
        </Drawer>
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
