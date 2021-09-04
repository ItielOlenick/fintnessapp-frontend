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
import { Col, Row, Drawer, Modal, Button } from "antd";
import AddLog from "./components/AddLog";
import LogList from "./components/LogList";
import ViewLog from "./components/ViewLog";
import { useState } from "react";
function App() {
  const [user] = useAuthState(auth);

  //active workout

  //initiate new workout
  const start = ({ id, edit, empty }) => {
    if (active) {
      showModal();
      setWorkoutProps({ ...workoutProps, id: id, edit: edit, empty: empty });
    } else {
      setWorkoutProps({ ...workoutProps, id: id, edit: edit, empty: empty });
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
    start({ ...workoutProps });
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
            Resume Workout
          </Button>
        </div>
      ) : (
        <></>
      )}
      {active ? (
        <Drawer
          contentWrapperStyle={{ bottom: 60 }}
          placement="bottom"
          visible={visible}
          onClose={onClose}
          height={"calc(100% - 60px)"}
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
        You have a active workout session. are you sure you want to terminate it
        and start a new one?
      </Modal>
    </BrowserRouter>
  );
}

export default App;
