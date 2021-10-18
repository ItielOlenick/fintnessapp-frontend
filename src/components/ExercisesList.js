import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExercisesService from "../services/ExercisesService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";

import {
  Col,
  Row,
  Button,
  Tooltip,
  List,
  Card,
  Popconfirm,
  Spin,
  Modal,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import AddExercise from "./AddExercise";

const ExercisesList = () => {
  const [exercises, SetExercises] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [id, setId] = useState();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (user)
      ExercisesService.getAll(user.uid)
        .then((response) => {
          SetExercises(response.data);
          setCount(response.data.length);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error - something is wrong", error);
        });
  }, [user, count, edit]);

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
    setEdit(false);
  };

  const handleCancel = () => {
    setVisible(false);
    setEdit(false);
  };
  const [show, setShow] = useState(false);
  const timer = setTimeout(() => {
    setShow(true);
  }, 300);

  return (
    <>
      <Row>
        <Col span={24}>
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
            <>
              {
                <div className="sameRowAround" style={{ marginBottom: 50 }}>
                  <h2 style={{ margin: 0 }}>Custom Exercises</h2>
                </div>
              }
              <>
                {exercises.length > 0 ? (
                  <List
                    header={
                      <div className="sameRow">
                        My Exercises
                        <Tooltip title="Add Exercise">
                          <Button
                            type="primary"
                            shape="circle"
                            onClick={showModal}
                          >
                            <PlusOutlined />
                          </Button>
                        </Tooltip>
                      </div>
                    }
                    grid={{ gutter: 0, column: 1 }}
                    dataSource={exercises}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <Card
                          className="cardNoBody"
                          size="small"
                          // hoverable="true"
                          title={item.name}
                          extra={[
                            // <Button
                            //   type="link"
                            //   onClick={() => {
                            //     setEdit(true);
                            //     setId(item.id);
                            //     showModal();
                            //   }}
                            //   icon={
                            <EditOutlined
                              onClick={() => {
                                setEdit(true);
                                setId(item.id);
                                showModal();
                              }}
                              key="edit"
                              style={{ marginRight: 15 }}
                            />,
                            //   }
                            // />,

                            <Popconfirm
                              title="Sure to delete?"
                              onConfirm={() => {
                                ExercisesService.remove(item.id).then(
                                  setCount(count - 1)
                                );
                              }}
                              onCancel={() => console.log("cancel")}
                            >
                              <DeleteOutlined key="delete" />
                            </Popconfirm>,
                          ]}
                        ></Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <>
                    <div className="sameRow">
                      My Exercises
                      <Tooltip title="Add Exercise">
                        <Button
                          type="primary"
                          shape="circle"
                          onClick={showModal}
                        >
                          <PlusOutlined />
                        </Button>
                      </Tooltip>
                    </div>
                    <br />
                    <p> Create an exercise and it will appear here.</p>
                    <p>
                      You will be able to choose your custom exercises when
                      creating your workouts.
                    </p>
                  </>
                )}
              </>
            </>
          )}
        </Col>
      </Row>
      <Modal
        title={edit ? "Update custom exercise" : "Add a custom exercise"}
        visible={visible}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={null}
      >
        <AddExercise
          setCount={setCount}
          count={count}
          edit={edit}
          setEdit={setEdit}
          id={id}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  );
};

export default ExercisesList;
