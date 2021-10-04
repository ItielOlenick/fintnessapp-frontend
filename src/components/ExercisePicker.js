import {
  Col,
  Row,
  Form,
  Divider,
  Cascader,
  Checkbox,
  Space,
  InputNumber,
  Button,
  Modal,
  Switch,
  Input,
} from "antd";
import {
  MinusCircleOutlined,
  MenuOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import AddExercise from "./AddExercise";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const ExercisePicker = ({ options, form, setCount, log }) => {
  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  function dropdownRender(menus) {
    return (
      <>
        <div className="cascaderDropdown">{menus}</div>
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: 8 }}>
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
    return path[1].label;
  }

  //modal
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  var reorder = () => {};
  const onChange = (checked) => {
    checked ? setOrder(true) : setOrder(false);
  };

  const [order, setOrder] = useState(false);
  return (
    <>
      <Row gutter={8}>
        <Col span={18}>
          <Form.Item name="workoutName" label="Workout Name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end ",
            }}
          >
            <Form.Item className="switch-mobile" label="Reorder">
              <Switch onChange={(checked) => onChange(checked)} />
            </Form.Item>
          </div>
        </Col>
      </Row>
      <p>Exercises</p>
      <DragDropContext
        // onDragStart={() => setDragging(true)}
        onDragEnd={(result) => {
          if (!result.destination) return;
          reorder(result.source.index, result.destination.index);
        }}
      >
        <Droppable droppableId="exercises">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Form.List name="exercises">
                {(fields, { add, remove, move }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }, i) => (
                      <Draggable
                        key={name.toString()}
                        draggableId={name.toString()}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <>{(reorder = move)}</>
                            <Row gutter={8}>
                              <Col
                                span={2}
                                style={
                                  order
                                    ? {
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        paddingTop: 9,
                                      }
                                    : { display: "none" }
                                }
                              >
                                <MenuOutlined {...provided.dragHandleProps} />
                              </Col>
                              <Col span={order ? 20 : 22}>
                                <Form.Item
                                  // noStyle
                                  {...restField}
                                  name={[name, "exercisePath"]}
                                  fieldKey={[fieldKey, "exercisePath"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing exercise",
                                    },
                                  ]}
                                >
                                  <Cascader
                                    allowClear={false}
                                    style={{ width: "100%" }}
                                    placeholder="exercise"
                                    options={options}
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
                              <Col
                                span={2}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  paddingTop: 9,
                                }}
                              >
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              </Col>
                            </Row>
                            <Row
                              style={
                                order
                                  ? {
                                      display: "none",
                                    }
                                  : {}
                              }
                            >
                              <Col span={24}>
                                <Form.List name={[name, "sets"]}>
                                  {(fields, { add, remove }) => (
                                    <>
                                      {fields.map(
                                        ({
                                          key,
                                          name,
                                          fieldKey,
                                          ...restField
                                        }) => (
                                          <Row gutter={8}>
                                            {log ? (
                                              <Col span={3}>
                                                <Form.Item
                                                  {...restField}
                                                  name={[name, "done"]}
                                                  fieldKey={[fieldKey, "done"]}
                                                  valuePropName="checked"
                                                >
                                                  <Checkbox></Checkbox>
                                                </Form.Item>
                                              </Col>
                                            ) : (
                                              <></>
                                            )}
                                            <Col span={log ? 21 : 24}>
                                              <Space
                                                key={key}
                                                style={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                                align="baseline"
                                                wrap="true"
                                              >
                                                <Space align="baseline">
                                                  <Form.Item
                                                    {...restField}
                                                    name={[name, "reps"]}
                                                    fieldKey={[
                                                      fieldKey,
                                                      "reps",
                                                    ]}
                                                    rules={
                                                      log
                                                        ? [
                                                            {
                                                              required: true,
                                                              message:
                                                                "Missing reps",
                                                            },
                                                          ]
                                                        : null
                                                    }
                                                  >
                                                    <InputNumber
                                                      type="number"
                                                      placeholder="Reps"
                                                      style={{
                                                        width: "95%",
                                                      }}
                                                    />
                                                  </Form.Item>

                                                  <Form.Item
                                                    {...restField}
                                                    name={[name, "weight"]}
                                                    fieldKey={[
                                                      fieldKey,
                                                      "weight",
                                                    ]}
                                                    rules={
                                                      log
                                                        ? [
                                                            {
                                                              required: true,
                                                              message:
                                                                "missing weight",
                                                            },
                                                          ]
                                                        : null
                                                    }
                                                  >
                                                    <InputNumber
                                                      type="number"
                                                      placeholder="Weight"
                                                      style={{
                                                        width: "95%",
                                                      }}
                                                    />
                                                  </Form.Item>
                                                  {/* <Space> */}
                                                  <MinusCircleOutlined
                                                    onClick={() => remove(name)}
                                                  />
                                                  {/* </Space> */}
                                                </Space>
                                              </Space>
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            if (
                                              form.getFieldValue([
                                                "exercises",
                                                i,
                                              ]) != undefined
                                            )
                                              add(
                                                form.getFieldValue([
                                                  "exercises",
                                                  i,
                                                  "sets",
                                                ]) != undefined
                                                  ? {
                                                      exercisePath:
                                                        form.getFieldValue([
                                                          "exercises",
                                                          i,
                                                        ]).exercisePath,
                                                      ...form.getFieldValue([
                                                        "exercises",
                                                        i,
                                                        "sets",
                                                        form.getFieldValue([
                                                          "exercises",
                                                          i,
                                                          "sets",
                                                        ]).length - 1,
                                                      ]),
                                                    }
                                                  : {
                                                      exercisePath:
                                                        form.getFieldValue([
                                                          "exercises",
                                                          i,
                                                        ]).exercisePath,
                                                    },
                                                form.getFieldValue([
                                                  "exercises",
                                                  i,
                                                  "sets",
                                                ]) != undefined
                                                  ? form.getFieldValue([
                                                      "exercises",
                                                      i,
                                                      "sets",
                                                    ]).length - 1
                                                  : ""
                                              );
                                          }}
                                          block
                                          icon={<PlusOutlined />}
                                        >
                                          Add Set
                                        </Button>
                                      </Form.Item>
                                    </>
                                  )}
                                </Form.List>
                                <Divider />
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Form.Item
                    // style={
                    //   dragging
                    //     ? {
                    //         display: "none",
                    //       }
                    //     : {}
                    // }
                    >
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Exercise
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal
        zIndex={2000}
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

export default ExercisePicker;
