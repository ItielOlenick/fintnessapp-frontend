import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { Collapse, Form, Input, Button, Spin, message } from "antd";

import WgerService from "../services/WgerService";
import LogService from "../services/LogService";
import Stopwatch from "./Stopwatch";
import ExercisePicker from "./ExercisePicker";

const AddLog = (props) => {
  console.log(props.location.state.id);
  const [started, setStarted] = useState({ started: false, timeStarted: "" });
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
          console.log("printing response", response.data);
          // getExercises(response.data);
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
    getWorkout();
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
    console.log(wgerExercises);
    const temp = [...options];
    temp[0].children = wgerExercises;
    setOptions(temp);
    console.log("options:", options);
    setLoading(false);
  }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const getWorkout = () => {
    (!props.location.state.edit
      ? WorkoutService.get(props.location.state.id)
      : LogService.get(props.location.state.id)
    ).then((data) => {
      const uniqueSets = getUniqueListBy(data.data.sets, "name").map((v) => {
        return data.data.sets.filter((c) => c.name === v.name);
      });

      const workout = {
        workoutName: data.data.name,
        exercises: uniqueSets.map((value, i) => ({
          exercisePath: JSON.parse(value[0].exercisePath),
          sets: uniqueSets[i],
        })),
        notes: data.data.notes,
        startedAt: data.data.startedAt,
        endedAt: data.data.endedAt,
      };

      form.setFieldsValue(workout);
    });
  };

  const history = useHistory();

  const onFinish = (workout) => {
    const log = {
      name: workout.workoutName,
      sets: workout.exercises
        .map((exercise, j) =>
          exercise.sets.flatMap((set, i) =>
            set.done
              ? {
                  name: exercise.exercisePath[exercise.exercisePath.length - 1],
                  reps: set.reps,
                  weight: set.weight,
                  exercisePath: JSON.stringify(
                    workout.exercises[j].exercisePath
                  ),
                  category:
                    exercise.exercisePath[exercise.exercisePath.length - 2],
                }
              : []
          )
        )
        .flat(),
      user: { id: user.uid },
      notes: workout.notes,
      startedAt: started.timeStarted,
      endedAt: new Date().toISOString(),
    };
    console.log("log: ", log);
    if (log.sets.length > 0) {
      console.log("savings workout", log);
      LogService.create(log)
        .then((response) => {
          console.log("Workout logged successfully", response.data);
          history.push("/logList");
        })
        .catch((error) => {
          console.log("Somthing went wrong");
        });
    } else console.log("Empty workout");
  };

  return (
    <>
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
      ) : (
        <>
          <Collapse ghost>
            <Panel header="Stopwatch" key="1" showArrow={false}>
              <div style={{ alignItems: "center" }}>
                <Stopwatch />
              </div>
            </Panel>
          </Collapse>
          <br />
          <Form form={form} onFinish={onFinish}>
            <ExercisePicker
              options={options}
              setCount={setCount}
              form={form}
              log={true}
            />
            <Form.Item name="notes" label="Workout notes">
              <TextArea rows={5} />
            </Form.Item>
            {started.started ? (
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
              <Button
                type="primary"
                htmlType="button"
                onClick={() => {
                  // console.log("workout as of now: ", form.getFieldsValue(true));
                  setStarted({
                    started: true,
                    timeStarted: new Date().toISOString(),
                  });
                }}
              >
                Start
              </Button>
            )}
          </Form>
        </>
      )}
    </>
  );
};

export default AddLog;
