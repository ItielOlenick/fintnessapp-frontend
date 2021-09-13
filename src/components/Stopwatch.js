import { useState } from "react";
import { Statistic, Button, Row, Col, Space } from "antd";
import {
  PauseOutlined,
  CaretRightOutlined,
  UndoOutlined,
} from "@ant-design/icons";
const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [stopwatch, setStopwatch] = useState();
  const [start, setStart] = useState(false);

  let ms = time % 100;
  let sec = Math.floor(time / 100) % 60;
  let min = Math.floor(time / 100 / 60) % 60;
  let hr = Math.floor(time / 100 / 60 / 60) % 24;

  let dms = ms < 10 ? "0" + ms : ms;
  let dsec = sec < 10 ? "0" + sec : sec;
  let dmin = min < 10 ? "0" + min : min;
  let dhr = hr < 10 ? "0" + hr : hr;

  const control = (action) => {
    if (!start) {
      if (action === "start") {
        const startTime = Date.now();
        setStart(true);
        setStopwatch(
          setInterval(() => {
            setTime(time + Math.floor((Date.now() - startTime) / 10));
          }, 10)
        );
      }
      if (action === "clear") {
        setTime(0);
      }
    }
    if (action === "pause") {
      setStart(false);
      clearInterval(stopwatch);
    }
  };

  return (
    <Row>
      <Col
        xs={24}
        md={12}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Statistic value={`${dhr}:${dmin}:${dsec}:${dms}`} />
      </Col>
      <Col
        xs={24}
        md={12}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Space>
          {start ? (
            <Button
              onClick={() => {
                control("pause");
              }}
            >
              <PauseOutlined />
            </Button>
          ) : (
            <Button
              onClick={() => {
                control("start");
              }}
            >
              <CaretRightOutlined />
            </Button>
          )}

          <Button
            onClick={() => {
              control("clear");
            }}
          >
            <UndoOutlined />
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default Stopwatch;
