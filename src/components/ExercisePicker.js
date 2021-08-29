import {
  Col,
  Row,
  Form,
  Cascader,
  Checkbox,
  Space,
  InputNumber,
  Button,
  Modal,
} from "antd";
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import AddExercise from "./AddExercise";

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

  //modal
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Form.List name="exercises">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, i) => (
              <>
                <Row gutter={8}>
                  <Col md={22} xs={22}>
                    <Form.Item
                      // noStyle
                      {...restField}
                      name={[name, "exercisePath"]}
                      fieldKey={[fieldKey, "exercisePath"]}
                      rules={[{ required: true, message: "Missing exercise" }]}
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
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.List name={[name, "sets"]}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(
                            ({ key, name, fieldKey, ...restField }) => (
                              <Row gutter={8}>
                                {log ? (
                                  <Col span={2}>
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
                                <Col span={log ? 22 : 24}>
                                  <Space
                                    key={key}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                    align="baseline"
                                    wrap="true"
                                  >
                                    <Space align="baseline">
                                      <Form.Item
                                        {...restField}
                                        name={[name, "reps"]}
                                        fieldKey={[fieldKey, "reps"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Missing reps",
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          placeholder="Reps"
                                          style={{ width: "100%" }}
                                        />
                                      </Form.Item>

                                      <Form.Item
                                        {...restField}
                                        name={[name, "weight"]}
                                        fieldKey={[fieldKey, "weight"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "missing weight",
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          placeholder="Weight"
                                          style={{ width: "100%" }}
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
                                  form.getFieldValue(["exercises", i]) !=
                                  undefined
                                )
                                  add(
                                    form.getFieldValue([
                                      "exercises",
                                      i,
                                      "sets",
                                    ]) != undefined
                                      ? {
                                          exercisePath: form.getFieldValue([
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
                                          exercisePath: form.getFieldValue([
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
              </>
            ))}

            <Form.Item>
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

export default ExercisePicker;
