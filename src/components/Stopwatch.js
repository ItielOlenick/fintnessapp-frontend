import { useEffect, useState } from "react";
import { Statistic, Button, Row, Col, Space } from "antd";

const Stopwatch = () => {
  const [time, setTime] = useState({ hr: 0, min: 0, sec: 0, ms: 0 });
  const [stopwatch, setStopwatch] = useState();
  const [start, setStart] = useState(false);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    arrange();
    pad();
  }, [time]);

  const arrange = () => {
    if (time.ms === 100)
      setTime((time) => ({ ...time, sec: time.sec + 1, ms: 0 }));
    if (time.sec === 60)
      setTime((time) => ({ ...time, min: time.min + 1, sec: 0 }));
    if (time.min === 60)
      setTime((time) => ({ ...time, hr: time.hr + 1, min: 0 }));
  };

  const pad = () => {
    let hr = time.hr.toString();
    let min = time.min.toString();
    let sec = time.sec.toString();
    let ms = time.ms.toString();
    if (hr < 10) hr = "0" + hr;
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;
    if (ms < 10) ms = "0" + ms;
    setDisplay(`${hr}:${min}:${sec}:${ms}`);
  };

  const control = (action) => {
    if (!start) {
      if (action === "start") {
        setStart(true);
        setStopwatch(
          setInterval(() => {
            setTime((time) => ({ ...time, ms: time.ms + 1 }));
          }, 10)
        );
      }
      if (action === "clear") {
        setTime({ hr: 0, min: 0, sec: 0, ms: 0 });
      }
    }
    if (action === "pause") {
      setStart(false);
      clearInterval(stopwatch);
    }
  };

  return (
    <div>
      <Row>
        <Col xs={24} md={12}>
          <Statistic value={display} />
        </Col>
        <Col xs={24} md={12} style={{ display: "flex", alignItems: "center" }}>
          <Space>
            {start ? (
              <Button
                onClick={() => {
                  control("pause");
                }}
              >
                stop
              </Button>
            ) : (
              <Button
                onClick={() => {
                  control("start");
                }}
              >
                start
              </Button>
            )}

            <Button
              onClick={() => {
                control("clear");
              }}
            >
              reset
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Stopwatch;
