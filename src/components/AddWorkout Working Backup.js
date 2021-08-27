import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Cascader,
  Spin,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import WgerService from "../services/WgerService";

const AddWorkout = () => {
  const [user] = useAuthState(auth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
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
  }, [user]);

  useEffect(() => getWger(), []);

  async function getWger() {
    // const categories = await WgerService.getCategories().then((data) => {
    const categories = await WgerService.getCategories().then((data) => {
      const cats = [
        ...data.data.map((values) => ({
          value: values.name,
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
            label: category.value,
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

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  const displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      if (i === labels.length - 1) {
        return <span key={option.value}>{label}</span>;
      }
      return <span key={option.value}></span>;
    });

  function render(inputValue, path) {
    if (path.length === 3 && typeof path[2].value === "string") {
      return path[2].value;
    }
    console.log(path);
    return path[1].label;
  }

  const history = useHistory();

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const onFinish = (values) => {
    const workout = {
      name: values.workoutName,
      sets: values.sets.map((val) => ({
        name: val.exercise[val.exercise.length - 1],
        reps: val.reps,
        weight: val.weight,
        exercisePath: JSON.stringify(val.exercise),
      })),
      owner: user.uid,
    };
    console.log("workout:", workout);
    if (workout.sets.length > 0) {
      WorkoutService.create(workout)
        .then((response) => {
          console.log("Workout added successfully", response.data);
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
          <Form.Item name="workoutName" label="Workout Name">
            <Input />
          </Form.Item>
          <Form.List name="sets">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <>
                    <Space
                      key={key}
                      style={{ display: "flex", justifyContent: "center" }}
                      align="baseline"
                      wrap="true"
                    >
                      <Form.Item
                        noStyle
                        {...restField}
                        name={[name, "exercise"]}
                        fieldKey={[fieldKey, "exercise"]}
                        rules={[
                          { required: true, message: "Missing exercise" },
                        ]}
                      >
                        <Cascader
                          placeholder="exercise"
                          options={options}
                          onChange={onChange}
                          // changeOnSelect
                          showSearch={{
                            filter,
                            matchInputWidth: false,
                            render,
                          }}
                          displayRender={displayRender}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "reps"]}
                        fieldKey={[fieldKey, "reps"]}
                        rules={[
                          { required: true, message: "missing number of reps" },
                        ]}
                      >
                        <InputNumber placeholder="Reps" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "weight"]}
                        fieldKey={[fieldKey, "weight"]}
                        rules={[{ required: true, message: "missing weight" }]}
                      >
                        <InputNumber placeholder="Weight" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  </>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Set
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default AddWorkout;
