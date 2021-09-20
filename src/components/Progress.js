import { Line } from "@ant-design/charts";
import { useEffect } from "react";
import SetService from "../services/SetService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { useState } from "react";

const Progress = (props) => {
  const [sets, SetSets] = useState([]);
  const [user] = useAuthState(auth);
  const [pr, setPr] = useState([]);
  useEffect(() => {
    SetService.getPrsByName(user.uid, props.location.state.setName, true)
      .then((data) => {
        const setsToFormat = data.data.map((set) => ({
          date: formatDate(new Date(Date.parse(set.preformedAt))),
          weight: set.weight,
        }));
        SetSets(setsToFormat);
      })
      .catch((e) => console.log("error : ", e));
    SetService.getPrsByName(user.uid, props.location.state.setName, false).then(
      (data) => setPr(data.data[0])
    );
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

  const config = {
    annotations: [
      {
        type: "text",

        position: {
          // date: formatDate(new Date(Date.parse(pr.preformedAt))),
          weight: pr.weight,
        },
        content: "PR",
        offsetY: 10,
        offsetX: 5,
      },
      {
        type: "line",
        start: ["start", pr.weight],
        end: ["end", pr.weight],
        style: {
          stroke: "#F4664A",
          lineDash: [2, 2],
        },
      },
    ],
    yAxis: {
      label: {
        formatter: (data) => {
          return data + " kg";
        },
      },
    },
    xAxis: {
      // tickMethod: false,
      tickCount: 3,
      title: { text: "Date" },
      // label: {
      //   formatter: (data) => {
      //     return data.substring(3);
      //   },
      // },
    },
    padding: "auto",
    data: sets,
    appendPadding: [0, 10, 0, 0],
    xField: "date",
    yField: "weight",
    point: {
      size: 5,
      // shape: "diamond",
    },
    slider: {
      handlerStyle: { paddingTop: 100 },
      start: 0,
      end: 1,
      formatter: (data) => {
        return data.substring(3);
      },
    },
  };
  return (
    <>
      <h2>{props.location.state.setName}</h2>
      <h3>Personal Record: {pr.weight} kg</h3>
      <h3>Exercise Progress:</h3>
      <br />
      <Line {...config} />
    </>
  );
};

export default Progress;
