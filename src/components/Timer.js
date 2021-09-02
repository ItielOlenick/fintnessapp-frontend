import { useState } from "react";
import { Input, Statistic, Button, Row, Col, Space, Popover } from "antd";
import { useEffect } from "react";
import {
  UndoOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
const Timer = () => {
  let audio = new Audio("/alarm.mp3");
  const play = () => {
    audio.play();
  };

  const [time, setTime] = useState(0);
  const [stopwatch, setStopwatch] = useState();
  const [start, setStart] = useState(false);
  const [userTime, setUserTime] = useState(0);

  let ms = time % 100;
  let sec = Math.floor(time / 100) % 60;
  let min = Math.floor(time / 100 / 60) % 60;
  let hr = Math.floor(time / 100 / 60 / 60) % 24;

  let dms = ms < 10 ? "0" + ms : ms;
  let dsec = sec < 10 ? "0" + sec : sec;
  let dmin = min < 10 ? "0" + min : min;
  let dhr = hr < 10 ? "0" + hr : hr;

  // The wake lock sentinel.
  let wakeLock = null;

  // Function that attempts to request a screen wake lock.
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request();
      wakeLock.addEventListener("release", () => {
        console.log("Screen Wake Lock released:", wakeLock.released);
      });
      console.log("Screen Wake Lock released:", wakeLock.released);
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  const keepAwake = async (time) => {
    // Request a screen wake lock…
    await requestWakeLock();
    // …and release it again after 5s.
    window.setTimeout(() => {
      wakeLock.release();
      wakeLock = null;
    }, time);
  };

  useEffect(() => {
    if (time <= 0 && userTime != 0) {
      play();
      setStart(false);
      clearInterval(stopwatch);
      setTime(0);
    }
  }, [time]);

  const control = (action) => {
    if (!start && time != 0) {
      if (action === "start") {
        const startTime = userTime != time ? Date.now() : Date.now() + 1000;

        setStart(true);
        setStopwatch(
          setInterval(() => {
            setTime(time + Math.floor((startTime - Date.now()) / 10));
          }, 10)
        );
        keepAwake(time > 0 ? time * 10 : userTime * 10);
      }
      if (action === "clear") {
        setTime(userTime);
      }
    }
    if (action === "clear" && time === 0) {
      setTime(userTime);
    }
    if (action === "pause") {
      setStart(false);
      clearInterval(stopwatch);
      keepAwake(0);
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
        <Statistic value={`${dhr}:${dmin}:${dsec}`} />
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
          {start ? (
            <Button>Set</Button>
          ) : (
            <Popover
              trigger="click"
              content={
                <>
                  <Input
                    type="time"
                    step={2}
                    onChange={(e) => {
                      setTime(
                        Date.parse("1970-01-01T" + e.target.value + "Z") / 10
                      );
                      setUserTime(
                        Date.parse("1970-01-01T" + e.target.value + "Z") / 10
                      );
                    }}
                  />
                </>
              }
            >
              <Button>Set</Button>
            </Popover>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default Timer;
