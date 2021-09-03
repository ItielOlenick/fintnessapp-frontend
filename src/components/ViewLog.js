import LogService from "../services/LogService";
import { auth } from "../services/firebase";
import { Table, List } from "antd";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const ViewLog = (props) => {
  const [user] = useAuthState(auth);
  const [log, setLog] = useState();
  const [loading, setLoading] = useState(true);
  const [unique, setUnique] = useState();
  const columns = [
    {
      title: "Reps",
      dataIndex: "reps",
      key: "reps",
      width: "15%",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "Weight",
      width: "15%",
    },
  ];

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

  const format = () => {};

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
              <List.Item key={item.id}>
                <h4>{item.name}</h4>

                {log.sets
                  .filter((s) => s.name === item.name)
                  .map((v, i) => (
                    <li>
                      {i + 1}. {v.reps} x {v.weight} kg
                    </li>
                  ))}
              </List.Item>
            )}
          />
        </>
      )}
    </>
  );
};

export default ViewLog;
