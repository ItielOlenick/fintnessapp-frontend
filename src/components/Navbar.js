import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { Menu, Layout, Row, Col } from "antd";
import { useEffect, useState } from "react";
import {
  CalendarOutlined,
  FireOutlined,
  BookOutlined,
} from "@ant-design/icons";

const Navbar = () => {
  const { Header } = Layout;
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const location = useLocation();

  const [user] = useAuthState(auth);
  const history = useHistory();

  const ConditionalWrap = ({ condition, wrap, children }) =>
    condition ? wrap(children) : children;

  return (
    <>
      <ConditionalWrap
        condition={width > 600}
        wrap={(children) => <Header>{children}</Header>}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          style={
            width > 600
              ? { justifyContent: "center" }
              : {
                  justifyContent: "center",
                  position: "fixed",
                  bottom: 0,
                  width: "100%",
                  zIndex: 1,
                }
          }
          defaultSelectedKeys={[location.pathname]}
        >
          {user ? (
            <>
              <Menu.Item key="/logList" style={{ width: 75, height: 65 }}>
                <Link to="/logList">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <CalendarOutlined
                      style={{ fontSize: 22, marginTop: 10, lineHeight: 1 }}
                    />
                    <p style={{ marginBottom: 0, lineHeight: 1.5 }}>Logs</p>
                  </div>
                </Link>
              </Menu.Item>
              <Menu.Item key="/" style={{ width: 75, height: 65 }}>
                <Link to="/">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <FireOutlined
                      style={{ fontSize: 22, marginTop: 10, lineHeight: 1 }}
                    />
                    <p style={{ marginBottom: 0, lineHeight: 1.5 }}>Workouts</p>
                  </div>
                </Link>
              </Menu.Item>
              <Menu.Item key="/exercises" style={{ width: 75, height: 65 }}>
                <Link to="/exercises">
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <BookOutlined
                      style={{ fontSize: 22, marginTop: 10, lineHeight: 1 }}
                    />
                    <p style={{ marginBottom: 0, lineHeight: 1.5 }}>
                      Exercises
                    </p>
                  </div>
                </Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="#">About</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </ConditionalWrap>
    </>
  );
};

export default Navbar;
