import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import {
  Collapse,
  Form,
  Input,
  Button,
  Spin,
  message,
  Popconfirm,
  notification,
  Divider,
  DatePicker,
} from "antd";
import moment from "moment";
import WgerService from "../services/WgerService";
import LogService from "../services/LogService";
import Stopwatch from "./Stopwatch";
import ExercisePicker from "./ExercisePicker";
import Timer from "./Timer";

const AddLog = (props) => {
  const [started, setStarted] = useState({
    started: false,
    timeStarted: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [form] = Form.useForm();
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState([
    {
      value: "wgerExercises",
      label: "Exercises",
      children: [],
    },
    {
      value: "userExercises",
      label: "Custom Exercises",
      children: [],
    },
  ]);
  const { Panel } = Collapse;
  const { TextArea } = Input;
  useEffect(() => {
    if (user)
      ExercisesService.getAll(user.uid)
        .then((response) => {
          const temp = [...options];
          temp[1].children = response.data.map((values) => ({
            value: values.name,
            label: values.name,
          }));
          setOptions(temp);
        })
        .catch((error) => {
          console.log("Error - something is wrong", error);
        });
  }, [user, count]);

  useEffect(() => {
    getWger();
    if (!props.location.state.empty) getWorkout();
  }, []);

  async function getWger() {
    const categories = await WgerService.getCategories().then((data) => {
      const cats = [
        ...data.data.map((values) => ({
          value: values.id,
          label: values.name,
          id: values.id,
        })),
      ];
      return cats;
    });

    const wgerExercises = [];
    const promises = [
      ...categories.map(async (category) => {
        await WgerService.getExercise(category.id).then((data) => {
          const exercises = [
            ...data.data.map((values) => ({
              value: values.name,
              label: values.name,
            })),
          ];
          wgerExercises.push({
            value: category.value,
            label: category.label,
            children: getUniqueListBy(exercises, "value"),
          });
        });
      }),
    ];
    await Promise.all(promises);
    const temp = [...options];
    temp[0].children = wgerExercises;
    setOptions(temp);
    setLoading(false);
  }

  const formatDate = (date) => {
    return (
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      date.getFullYear()
    );
  };

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const organize = (data) => {
    const uniqueSets = getUniqueListBy(data.sets, "name").map((v) => {
      const set = data.sets.filter((c) => c.name === v.name);
      if (props.location.state.edit) set.forEach((s) => (s.done = true));
      set.forEach((s) => {
        if (s.weight === 0) s.weight = null;
      });
      return set;
    });

    const workout = {
      workoutName: data.name,
      exercises: uniqueSets.map((value, i) => ({
        exercisePath: JSON.parse(value[0].exercisePath),
        sets: uniqueSets[i],
      })),
      notes: data.notes,
      startedAt: moment(data.startedAt),
      endedAt: data.endedAt,
    };

    form.setFieldsValue(workout);
  };

  const getWorkout = () => {
    if (props.location.state.samples) {
      organize(props.location.state.samples);
    } else {
      (!props.location.state.edit
        ? WorkoutService.get(props.location.state.id)
        : LogService.get(props.location.state.id)
      ).then((data) => {
        organize(data.data);
      });
    }
  };

  const history = useHistory();

  const multiplePr = (data) => {
    notification.open({
      duration: 0,
      message: "PR's broken this workout",
      description: data.flatMap((e, i, a) =>
        i % 2 === 0 ? (
          <>
            <h4 style={{ marginTop: 15 }}>{a[i].name}</h4>
            <>
              {a[i].weight}kg → {a[i + 1].weight}kg
            </>
            <Divider style={{ margin: "12px 0" }} />
          </>
        ) : (
          <></>
        )
      ),
    });
  };

  const onFinish = () => {
    const workout = form.getFieldsValue(true);
    const log = {
      id: props.location.state.edit ? props.location.state.id : null,
      name: workout.workoutName,
      sets: workout.exercises
        .map((exercise, j) =>
          exercise.sets.flatMap((set, i) =>
            set.done
              ? {
                  id: props.location.state.edit ? set.id : null,
                  name: exercise.exercisePath[exercise.exercisePath.length - 1],
                  reps: set.reps,
                  weight: set.weight,
                  exercisePath: JSON.stringify(
                    workout.exercises[j].exercisePath
                  ),
                  category:
                    exercise.exercisePath[exercise.exercisePath.length - 2],
                  user: { id: user.uid },
                  preformedAt: props.location.state.edit
                    ? workout.startedAt
                    : started.timeStarted,
                }
              : []
          )
        )
        .flat(),
      user: { id: user.uid },
      notes: workout.notes,
      startedAt: props.location.state.edit
        ? workout.startedAt
        : started.timeStarted,
      endedAt: new Date().toISOString(),
    };

    if (log.sets.length > 0) {
      (props.location.state.edit
        ? LogService.update(log)
        : LogService.create(log)
      )
        .then((response) => {
          if (response.data.length > 4)
            notification.open({
              key: "multiple",
              message: "Multiple PR's Broken! 💪",
              description: `You are in the zone!`,
              btn: (
                <Button
                  onClick={() => {
                    notification.close("multiple");
                    multiplePr(response.data);
                  }}
                >
                  View PR's
                </Button>
              ),
              duration: 0,
            });
          else
            response.data.forEach((element, i, a) => {
              if (i % 2 === 0) {
                notification.open({
                  message: "PR Broken! 💪",
                  description: `Congratulations! your broke your previous record for the ${
                    a[i].name
                  }. Your new PR is ${a[i + 1].weight}. Keep up the good work!`,
                  duration: 0,
                });
              }
            });
          if (!props.location.state.edit) props.done();
          history.push("/logList");
        })
        .catch((error) => {
          console.log("Somthing went wrong", error);
        });
    } else
      message.warn(
        "No completed sets. Please complete at least one set before saving the workout",
        5
      );
  };

  const [showLoad, setShowLoad] = useState(false);
  setTimeout(() => setShowLoad(true), 300);

  return (
    <>
      {loading ? (
        showLoad ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin tip="Loading..." />
          </div>
        ) : (
          <></>
        )
      ) : (
        <>
          {props.location.state.edit ? (
            <></>
          ) : (
            <>
              <Collapse>
                <Panel header="Stopwatch & Timer" key="1" showArrow={false}>
                  <div className="sameRow">
                    <Stopwatch />
                    <Timer />
                  </div>
                </Panel>
              </Collapse>
              <br />
            </>
          )}

          {started.started || props.location.state.edit ? (
            <></>
          ) : (
            <>
              <Button
                onClick={() =>
                  setStarted({
                    started: true,
                    timeStarted: new Date().toISOString(),
                  })
                }
                block
                type="primary"
              >
                Start Workout
              </Button>
              <br />
              <br />
            </>
          )}
          <Form form={form} onFinish={onFinish}>
            <div className="sameRow">
              {props.location.state.edit ? (
                <>
                  <h2 style={{ marginBottom: "1.2em" }}>Edit Workout</h2>
                  <Form.Item name="startedAt">
                    <DatePicker format="DD/MM/YYYY" />
                  </Form.Item>
                </>
              ) : (
                <>
                  <h2 style={{ marginBottom: "1.2em" }}>Workout</h2>
                </>
              )}
            </div>

            <ExercisePicker
              options={options}
              setCount={setCount}
              form={form}
              log={true}
            />
            <Form.Item name="notes" label="Workout notes">
              <TextArea
                rows={5}
                placeholder="Write something about your workout"
              />
            </Form.Item>
            <div className="sameRow">
              {props.location.state.edit ? (
                <Link to="/logList">
                  <Button>Cancel</Button>
                </Link>
              ) : (
                <Popconfirm
                  title="Sure to cancel Workout?"
                  onConfirm={() => props.done()}
                >
                  <Button>Cancel Workout</Button>
                </Popconfirm>
              )}

              {started.started || props.location.state.edit ? (
                <Button
                  type="primary"
                  onClick={() => {
                    if (
                      form.getFieldValue(["exercises", 0, "sets"]) != undefined
                    ) {
                      form.submit();
                    } else {
                      message.warn(
                        "Empty workout, please add at least one exercise"
                      );
                    }
                  }}
                >
                  Save
                </Button>
              ) : (
                <></>
              )}
            </div>
          </Form>
        </>
      )}
    </>
  );
};

export default AddLog;
