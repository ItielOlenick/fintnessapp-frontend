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
} from "antd";
import {
  MinusCircleOutlined,
  MenuOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
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
    console.log(path);
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

  const [dragging, setDragging] = useState();

  return (
    <div
    // style={
    //   dragging
    //     ? {
    //         paddingBottom: "150px",
    //       }
    //     : {}
    // }
    >
      <DragDropContext
        onDragStart={() => setDragging(true)}
        onDragEnd={(result) => {
          setDragging(false);
          if (!result.destination) return;
          reorder(result.source.index, result.destination.index);
        }}
      >
        <Droppable droppableId="exercises">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Form.List name="exercises">
                {(fields, { add, remove, move }) => (
                  <div>
                    {fields.map(({ key, name, fieldKey, ...restField }, i) => (
                      <Draggable
                        key={name.toString()}
                        draggableId={name.toString()}
                        index={i}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <div
                              style={
                                dragging
                                  ? {
                                      outline: "1px dashed #1890FF",

                                      background: "white",
                                    }
                                  : {}
                              }
                            >
                              <>{(reorder = move)}</>
                              <Row gutter={8}>
                                <Col
                                  span={2}
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    paddingTop: 9,
                                  }}
                                >
                                  <MenuOutlined {...provided.dragHandleProps} />
                                </Col>
                                <Col md={20} xs={20}>
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
                              // style={
                              //   dragging
                              //     ? {
                              //         display: "none",
                              //       }
                              //     : {}
                              // }
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
                                                <Col span={2}>
                                                  <Form.Item
                                                    {...restField}
                                                    name={[name, "done"]}
                                                    fieldKey={[
                                                      fieldKey,
                                                      "done",
                                                    ]}
                                                    valuePropName="checked"
                                                  >
                                                    <Checkbox></Checkbox>
                                                  </Form.Item>
                                                </Col>
                                              ) : (
                                                <></>
                                              )}
                                              <Col span={log ? 22 : 24}>
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
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            "Missing reps",
                                                        },
                                                      ]}
                                                    >
                                                      <InputNumber
                                                        placeholder="Reps"
                                                        style={{
                                                          width: "100%",
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
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            "missing weight",
                                                        },
                                                      ]}
                                                    >
                                                      <InputNumber
                                                        placeholder="Weight"
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                      />
                                                    </Form.Item>
                                                    {/* <Space> */}
                                                    <MinusCircleOutlined
                                                      onClick={() =>
                                                        remove(name)
                                                      }
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
                                </Col>
                              </Row>
                            </div>
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
                  </div>
                )}
              </Form.List>
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
    </div>
  );
};

export default ExercisePicker;
