import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WorkoutService from "../services/WorkoutService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import {
  Collapse,
  Col,
  Row,
  Button,
  Tooltip,
  List,
  Card,
  Popconfirm,
  Spin,
  Table,
  Space,
  Menu,
  Dropdown,
} from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";

const WorkoutList = () => {
  const [user] = useAuthState(auth);
  const [workouts, SetWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const { Panel } = Collapse;
  const [formatedWorkout, setFormattedWorkout] = useState();

  const sampleRoutines = [
    { name: "5x5", sets: [{ name: "s", count: 2 }] },
    { name: "Push", sets: [{ name: "s", count: 2 }] },
    { name: "Pull", sets: [{ name: "s", count: 2 }] },
    { name: "Legs", sets: [{ name: "s", count: 2 }] },
    { name: "A", sets: [{ name: "s", count: 2 }] },
    { name: "B", sets: [{ name: "s", count: 2 }] },
  ];
  // if i want to show unique repeating sets, with reps and kg,
  // get source from workouts, comment out the extra functions and comment in
  // the colum rendering that is commented out

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const format = () => {
    const unique = workouts.map((value) => {
      const uniqueSets = value.sets.map((v) => {
        return value.sets.filter((c) => c.name === v.name).length;
      });
      console.log("uniqueSets: ", uniqueSets);
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
      WorkoutService.getAll(user.uid)
        .then((response) => {
          SetWorkouts(response.data);
          setCount(response.data.length);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error - something is wrong", error);
        });
    format();
  }, [user, count]);

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

  const sample = (
    <List
      header={"Sample Routines"}
      grid={{ gutter: 0, column: 1 }}
      dataSource={sampleRoutines}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Link
            to={{
              pathname: "/logWorkout",
              search: "",
              hash: "#",
              state: { id: item.id },
            }}
          >
            <Card
              size="small"
              title={item.name}
              // hoverable="true"
              extra={
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
                          Create Workout From this Sample
                        </Link>
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
  );

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
              <>
                <div className="sameRowAround" style={{ marginBottom: 25 }}>
                  <h2 style={{ margin: 0 }}>Workouts</h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Tooltip title="New Workout">
                    <Link
                      to={{
                        pathname: `/logWorkout`,
                        search: "",
                        hash: "#",
                        state: { id: null, empty: true },
                      }}
                    >
                      <Button type="secondary">Start Empty Workout</Button>
                    </Link>
                  </Tooltip>
                </div>
              </>
            }
            {workouts.length > 0 ? (
              <>
                <List
                  header={
                    <div className="sameRow">
                      My Routines{" "}
                      <Tooltip title="New Workout">
                        <Link to={"/addWorkout"}>
                          <Button type="primary" shape="circle">
                            <PlusOutlined />
                          </Button>
                        </Link>
                      </Tooltip>
                    </div>
                  }
                  grid={{ gutter: 0, column: 1 }}
                  dataSource={formatedWorkout}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
                      <Link
                        to={{
                          pathname: "/logWorkout",
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
                            <Dropdown
                              trigger="click"
                              overlay={
                                <Menu>
                                  <Menu.Item key={item.id + 10}>
                                    <Link to={`/workouts/edit/${item.id}`}>
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
                                        WorkoutService.remove(item.id).then(
                                          () => {
                                            setCount(count - 100);
                                          }
                                        );
                                      }}
                                      onCancel={(event) => {
                                        event.stopPropagation();

                                        console.log("cancel");
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
                {sample}
              </>
            ) : (
              <>
                <div className="sameRow">
                  My Routines
                  <Tooltip title="New Workout">
                    <Link to={"/addWorkout"}>
                      <Button type="primary" shape="circle">
                        <PlusOutlined />
                      </Button>
                    </Link>
                  </Tooltip>
                </div>
                <br />
                <p>
                  No routines yet,
                  <br /> Create your first routine and will appear here
                </p>
                {sample}
              </>
            )}
          </>
        )}
      </Col>
    </Row>
  );
};

export default WorkoutList;
