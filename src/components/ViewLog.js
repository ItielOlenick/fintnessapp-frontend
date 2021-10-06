import LogService from "../services/LogService";
import { auth } from "../services/firebase";
import { List, Card, notification } from "antd";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import UserService from "../services/UserService";

const ViewLog = (props) => {
  const [user] = useAuthState(auth);
  const [log, setLog] = useState();
  const [loading, setLoading] = useState(true);
  const [unique, setUnique] = useState();

  useEffect(() => {
    if (user)
      LogService.get(props.location.state.id)
        .then((response) => {
          setLog(response.data);
          setUnique(
            // getUniqueListBy(response.data.sets, "name").map((u) =>
            //   response.data.sets.filter((s) => s.name === u.name)
            // )
            getUniqueListBy(response.data.sets, "name")
          );
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error - something is wrong", error);
        });
  }, []);
  useEffect(() => {
    if (user)
      UserService.get(user.uid).then((res) => {
        if (!res.data.firstLogView) {
          notification.open({
            key: "firstLogView",
            message: "Get a detailed view",
            description: `Click on an exercise to view your progress and personal record.`,
            duration: 0,
          });
          let userSettings = res.data;
          userSettings = { ...userSettings, firstLogView: true };
          UserService.update(userSettings);
        }
      });
  }, []);
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

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <>
          <div className="sameRow">
            <h2>{log.name}</h2>
            {formatDate(new Date(Date.parse(log.startedAt)))}
          </div>
          <List
            dataSource={unique}
            grid={{ gutter: 0, column: 1 }}
            renderItem={(item) => (
              <Link
                to={{
                  pathname: "/progress",
                  search: "",
                  hash: "#",
                  state: { setName: item.name },
                }}
              >
                <List.Item key={item.id}>
                  <Card size="small" title={item.name}>
                    {/* <ol> */}
                    {log.sets
                      .filter((s) => s.name === item.name)
                      .map((v, i) => (
                        <li>
                          &nbsp;&nbsp;&nbsp;&nbsp;{i + 1}. &nbsp;&nbsp;&nbsp;
                          {v.reps} x {v.weight} kg
                        </li>
                      ))}
                    {/* </ol> */}
                  </Card>
                </List.Item>
              </Link>
            )}
          />
          {log.notes ? (
            <>
              <h2>Workout Notes</h2>
              <Card size="small" style={{ background: "#ffffdf" }}>
                {log.notes}
              </Card>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default ViewLog;
