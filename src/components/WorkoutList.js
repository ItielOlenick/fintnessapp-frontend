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
  Popover,
  Menu,
  Dropdown,
} from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import UserService from "../services/UserService";

const WorkoutList = () => {
  const [user] = useAuthState(auth);
  const [workouts, SetWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const { Panel } = Collapse;
  const [formatedWorkout, setFromatedWorkout] = useState();

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

    setFromatedWorkout(unique);
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
    UserService.get(user.uid).then((v) => console.log(v));
    console.log(workouts);
  }, [user, count]);

  //

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

  // const menu = (

  // );

  return (
    <Row>
      <Col span={24}>
        <div className="sameRowAround" style={{ marginBottom: 50 }}>
          <h3 style={{ textAlign: "center" }}>Workouts</h3>
          <Tooltip title="New Workout">
            <Link to={"/addWorkout"}>
              <Button type="primary" shape="circle">
                <PlusOutlined />
              </Button>
            </Link>
          </Tooltip>
        </div>
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
        ) : workouts.length > 0 ? (
          <List
            grid={{ gutter: 0, column: 1 }}
            dataSource={formatedWorkout}
            renderItem={(item) => (
              <List.Item key={item.id}>
                {/* <Link to={`/workouts/${item.id}`}> */}
                <Card hoverable="true">
                  <Collapse bordered={false}>
                    <Panel
                      showArrow={false}
                      header={item.name}
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
                                    WorkoutService.remove(item.id);
                                    setCount(count - 1);
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
                      <Table
                        size="small"
                        dataSource={item.sets}
                        columns={columns}
                        pagination={false}
                        footer={() => (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Space size="large">
                              <Tooltip title="Start workout">
                                <Link
                                  to={{
                                    pathname: "/logWorkout",
                                    search: "",
                                    hash: "#",
                                    state: { id: item.id },
                                  }}
                                >
                                  <Button type="primary">Start Workout</Button>
                                </Link>
                              </Tooltip>
                            </Space>
                          </div>
                        )}
                      />
                    </Panel>
                  </Collapse>
                </Card>
                {/* </Link> */}
              </List.Item>
            )}
          />
        ) : (
          <div>Nothing to show yet.</div>
        )}
      </Col>
    </Row>
  );
};

export default WorkoutList;
