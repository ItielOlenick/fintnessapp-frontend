import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { Form, Input, Button, Spin, message } from "antd";
import WgerService from "../services/WgerService";
import ExercisePicker from "./ExercisePicker";

const AddWorkout = () => {
  const [user] = useAuthState(auth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => getWger(), []);

  const getWger = () => {
    // const categories = await WgerService.getCategories().then((data) => {
    WgerService.getCategories().then((data) => {
      const categories = [
        ...data.data.map((values) => ({
          value: values.id,
          label: values.name,
          id: values.id,
        })),
      ];

      const wgerExercises = [];
      const promises = [
        ...categories.map((category) => {
          WgerService.getExercise(category.id).then((data) => {
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
      Promise.all(promises);

      const temp = [...options];
      temp[0].children = wgerExercises;
      setOptions(temp);

      setLoading(false);
    });
  };

  const history = useHistory();

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const onFinish = (workout) => {
    const savedWorkout = {
      name: workout.workoutName,
      sets: workout.exercises
        .map((exercise, j) =>
          exercise.sets.flatMap((set, i) => ({
            name: set.exercisePath[set.exercisePath.length - 1],
            reps: set.reps,
            weight: set.weight,
            exercisePath: JSON.stringify(workout.exercises[j].exercisePath),
            category: set.exercisePath[set.exercisePath.length - 2],
          }))
        )
        .flat(),
      user: { id: user.uid },
    };
    if (savedWorkout.sets.length > 0) {
      WorkoutService.create(savedWorkout)
        .then((response) => {
          history.push("/");
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
        <Form form={form} onFinish={onFinish}>
          <ExercisePicker options={options} setCount={setCount} form={form} />
          <Form.Item>
            <Button
              type="primary"
              onClick={() => {
                if (form.getFieldValue(["exercises", 0, "sets"]) != undefined) {
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
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default AddWorkout;
