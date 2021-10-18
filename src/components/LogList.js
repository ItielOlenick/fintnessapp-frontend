import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import {
  Collapse,
  Col,
  Row,
  List,
  Card,
  Popconfirm,
  Spin,
  Menu,
  Dropdown,
  Divider,
  notification,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import UserService from "../services/UserService";
import LogService from "../services/LogService";

const LogList = ({ start, logCount }) => {
  const [user] = useAuthState(auth);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const { Panel } = Collapse;
  const [formattedWorkout, setFormattedWorkout] = useState();

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const format = () => {
    const unique = logs.map((value) => {
      const uniqueSets = value.sets.map((v) => {
        return value.sets.filter((c) => c.name === v.name).length;
      });
      return {
        ...value,
        sets: getUniqueListBy(
          value.sets.map((v, i) => ({
            ...v,
            count: uniqueSets[i],
          })),
          "name"
        ),
      };
    });
    setFormattedWorkout(unique);
  };

  useEffect(() => {
    if (user)
      LogService.getAll(user.uid)
        .then((response) => {
          setLogs(response.data);
          setCount(response.data.length);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error - something is wrong", error);
        });
    format();
  }, [user, count, logCount]);

  useEffect(() => {
    if (user)
      UserService.get(user.uid).then((res) => {
        if (!res.data.firstLogList && count > 0) {
          notification.open({
            key: "firstLogList",
            message: "Congratulations!",
            description: `You completed your first workout. Click on one of your past workouts to view it in detail and get insights on your work.`,
            duration: 0,
          });
          let userSettings = res.data;
          userSettings = { ...userSettings, firstLogList: true };
          UserService.update(userSettings);
        }
      });
  }, [count]);

  const columns = [
    {
      title: "Exercise",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sets",
      dataIndex: "count",
      key: "sets",
      width: "15%",
    },
  ];

  const [show, setShow] = useState(false);
  const timer = setTimeout(() => {
    setShow(true);
  }, 300);

  const formatDate = (date) => {
    return (
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      date.getFullYear()
    );
  };

  return (
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
                <h2 style={{ margin: 0 }}>Logs</h2>
              </div>
            }

            {logs.length > 0 ? (
              <List
                header="Workout History"
                grid={{ gutter: 0, column: 1 }}
                dataSource={formattedWorkout}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    <Link
                      to={{
                        pathname: "/viewLog",
                        search: "",
                        hash: "#",
                        state: { id: item.id },
                      }}
                    >
                      <Card
                        title={item.name}
                        size="small"
                        // hoverable="true"
                        extra={
                          <>
                            {formatDate(new Date(Date.parse(item.startedAt)))}
                            <Divider type="vertical" />
                            <Dropdown
                              trigger="click"
                              overlay={
                                <Menu>
                                  <Menu.Item key={item.id + 13}>
                                    <Link
                                      to={{
                                        pathname: `/addWorkoutFromLog`,
                                        search: "",
                                        hash: "#",
                                        state: { id: item.id },
                                      }}
                                    >
                                      Create Workout From this Log
                                    </Link>
                                  </Menu.Item>
                                  <Menu.Item key={item.id + 12}>
                                    <Link
                                      onClick={() => {
                                        start({ id: item.id });
                                      }}
                                      // to={{
                                      //   pathname: "/logWorkout",
                                      //   search: "",
                                      //   hash: "#",
                                      //   state: { id: item.id },
                                      // }}
                                    >
                                      Start Workout From This Log
                                    </Link>
                                  </Menu.Item>
                                  <Menu.Item key={item.id + 10}>
                                    <Link
                                      to={{
                                        pathname: `/logs/edit`,
                                        search: "",
                                        hash: "#",
                                        state: { id: item.id, edit: true },
                                      }}
                                    >
                                      Edit
                                    </Link>
                                  </Menu.Item>
                                  <Menu.Item key={item.id + 11}>
                                    <Popconfirm
                                      onClick={(event) => {
                                        event.stopPropagation();
                                      }}
                                      title="Sure to delete?"
                                      onConfirm={(event) => {
                                        event.stopPropagation();
                                        LogService.remove(item.id).then(() => {
                                          setCount(count - 100);
                                        });
                                      }}
                                      onCancel={(event) => {
                                        event.stopPropagation();
                                      }}
                                    >
                                      Delete
                                    </Popconfirm>
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <MoreOutlined
                                onClick={(event) => {
                                  event.stopPropagation();
                                }}
                              />
                            </Dropdown>
                          </>
                        }
                      >
                        {item.sets.map((set) => (
                          <li>
                            {set.count} x {set.name}
                          </li>
                        ))}
                      </Card>
                    </Link>
                  </List.Item>
                )}
              />
            ) : (
              <div>No workouts recorded yet.</div>
            )}
          </>
        )}
      </Col>
    </Row>
  );
};

export default LogList;
