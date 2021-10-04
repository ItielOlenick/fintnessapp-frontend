import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { Form, Input, Button, Spin, message } from "antd";
import WgerService from "../services/WgerService";
import ExercisePicker from "./ExercisePicker";
const EditWorkout = (props) => {
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const { id } = useParams();
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
          // console.log(`exercises of category ${category.value}`, exercises);
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

  const getWorkout = () => {
    WorkoutService.get(id ? id : props.location.state.id).then((data) => {
      const uniqueSets = getUniqueListBy(data.data.sets, "name").map((v) => {
        return data.data.sets.filter((c) => c.name === v.name);
      });

      const workout = {
        workoutName: data.data.name,
        exercises: uniqueSets.map((value, i) => ({
          exercisePath: JSON.parse(value[0].exercisePath),
          sets: uniqueSets[i],
        })),
      };

      form.setFieldsValue(workout);
    });
  };

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const history = useHistory();

  const onFinish = (workout) => {
    const savedWorkout = {
      id: id,
      name: workout.workoutName,
      sets: workout.exercises
        .map((exercise, j) =>
          exercise.sets.flatMap((set, i) => ({
            name: exercise.exercisePath[exercise.exercisePath.length - 1],
            reps: set.reps,
            weight: set.weight,
            exercisePath: JSON.stringify(workout.exercises[j].exercisePath),
            category: exercise.exercisePath[exercise.exercisePath.length - 2],
          }))
        )
        .flat(),
      user: { id: user.uid },
    };
    if (savedWorkout.sets.length > 0) {
      WorkoutService.update(savedWorkout)
        .then((response) => {
          history.push("/");
        })
        .catch((error) => {
          console.log("Somthing went wrong");
        });
    } else console.log("Empty workout");
  };

  const [show, setShow] = useState(false);
  const timer = setTimeout(() => {
    setShow(true);
  }, 300);

  return (
    <>
      {loading ? (
        show ? (
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

export default EditWorkout;
