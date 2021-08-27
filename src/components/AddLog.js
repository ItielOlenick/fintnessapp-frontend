import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import {
  Collapse,
  Checkbox,
  Popconfirm,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Cascader,
  Spin,
  Col,
  Modal,
  Row,
} from "antd";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import WgerService from "../services/WgerService";
import LogService from "../services/LogService";
import Stopwatch from "./Stopwatch";
import AddExercise from "./AddExercise";

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
  }, [user]);

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
    console.log(wgerExercises);
    const temp = [...options];
    temp[0].children = wgerExercises;
    setOptions(temp);
    console.log("options:", options);
    setLoading(false);
  }

  const getWorkout = () => {
    WorkoutService.get(props.location.state.id).then((data) => {
      const workout = {
        workoutName: data.data.name,
        sets: data.data.sets.map((value) => ({
          exercise: JSON.parse(value.exercisePath),
          reps: value.reps,
          weight: value.weight,
          category: value.category,
          id: value.id,
          done: false,
        })),
      };
      console.log("here we are again:", workout);
      form.setFieldsValue(workout);
    });
  };

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

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
  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const history = useHistory();

  const onFinish = (values) => {
    const log = {
      name: values.workoutName,
      sets: values.sets.flatMap((val, i) =>
        val.done
          ? {
              name: val.exercise[val.exercise.length - 1],
              reps: val.reps,
              weight: val.weight,
              exercisePath: JSON.stringify(val.exercise),
              category: val.exercise[val.exercise.length - 2],
            }
          : []
      ),
      user: { id: user.uid },
      notes: values.notes,
      startedAt: started.timeStarted,
      endedAt: new Date().toISOString(),
    };
    if (log.sets.length > 0) {
      console.log("savings workout", log);
      LogService.create(log)
        .then((response) => {
          console.log("Workout logged successfully", response.data);
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
            <Form.Item name="workoutName" label="Workout Name">
              <Input />
            </Form.Item>
            <Form.List name="sets">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row gutter={8}>
                      <Col span={2}>
                        {" "}
                        <Form.Item
                          {...restField}
                          name={[name, "done"]}
                          fieldKey={[fieldKey, "done"]}
                          valuePropName="checked"
                        >
                          <Checkbox
                            onChange={() => {
                              console.log(form.getFieldValue(["sets"]));
                            }}
                          ></Checkbox>
                        </Form.Item>
                      </Col>
                      <Col md={10} xs={22}>
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
            <Form.Item name="notes" label="Workout notes">
              <TextArea rows={5} />
            </Form.Item>
            {/* <Form.Item> */}
            {started.started ? (
              <Button
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="button"
                onClick={() => {
                  setStarted({
                    started: true,
                    timeStarted: new Date().toISOString(),
                  });
                }}
              >
                Start
              </Button>
            )}
            {/* </Form.Item> */}
          </Form>
        </>
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

export default AddLog;
