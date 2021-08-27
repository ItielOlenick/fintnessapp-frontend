import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import {
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  Space,
  Cascader,
  Spin,
  Modal,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import WgerService from "../services/WgerService";
import AddExercise from "./AddExercise";

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
      console.log(wgerExercises);
      const temp = [...options];
      temp[0].children = wgerExercises;
      setOptions(temp);
      console.log("options:", options);
      setLoading(false);
    });
  };

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  const onChange = (value, selectedOptions) => {
    console.log("value:", value, "selectedOptions:", selectedOptions);
    // form.setF({
    //   category: selectedOptions[selectedOptions.length - 1].category,
    // });
    console.log(form.getFieldsValue(true));
  };

  const displayRender = (labels, selectedOptions) =>
    labels.map((label, i) => {
      const option = selectedOptions[i];
      if (i === labels.length - 1) {
        return <span key={option.value}>{label}</span>;
      }
      return <span key={option.value}></span>;
    });

  function dropdownRender(menus) {
    return (
      <>
        <div className="cascaderDropdown">{menus}</div>
        <div>
          <a onClick={showModal}>Add an exercise</a>
        </div>
      </>
    );
  }

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
    console.log("values:", values);
    const workout = {
      name: values.workoutName,
      sets: values.sets.map((val) => ({
        name: val.exercise[val.exercise.length - 1],
        reps: val.reps,
        weight: val.weight,
        exercisePath: JSON.stringify(val.exercise),
        category: val.exercise[val.exercise.length - 2],
      })),
      user: { id: user.uid },
    };
    console.log("workout:", workout);
    if (workout.sets.length > 0) {
      console.log("savings workout", workout);
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

  //Modal
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
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
                  <Row gutter={8}>
                    <Col md={12} xs={24}>
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
                          allowClear={false}
                          style={{ width: "100%" }}
                          placeholder="exercise"
                          options={options}
                          onChange={onChange}
                          dropdownRender={dropdownRender}
                          showSearch={{
                            filter,
                            matchInputWidth: false,
                            render,
                          }}
                          displayRender={displayRender}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={12} xs={24}>
                      <Space
                        key={key}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        align="baseline"
                        wrap="true"
                      >
                        <Space>
                          <Form.Item
                            {...restField}
                            name={[name, "reps"]}
                            fieldKey={[fieldKey, "reps"]}
                            rules={[
                              {
                                required: true,
                                message: "missing number of reps",
                              },
                            ]}
                          >
                            <InputNumber placeholder="Reps" />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "weight"]}
                            fieldKey={[fieldKey, "weight"]}
                            rules={[
                              { required: true, message: "missing weight" },
                            ]}
                          >
                            <InputNumber placeholder="Weight" />
                          </Form.Item>
                        </Space>
                        <Space>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                          <PlusCircleOutlined
                            onClick={() => {
                              add(form.getFieldValue(["sets", name]), name);
                            }}
                          />
                        </Space>
                      </Space>
                    </Col>
                  </Row>
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
      <Modal
        title={"Add a custom exercise"}
        visible={visible}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={null}
      >
        <AddExercise
          setCount={setCount}
          intra={true}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  );
};

export default AddWorkout;
