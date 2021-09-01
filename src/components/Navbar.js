import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { Menu, Layout, Row, Col } from "antd";
import { useEffect, useState } from "react";
import {
  SettingOutlined,
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

  const miStyle = { width: 70, height: 60 };
  const divStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const iconStyle = { fontSize: 22, marginTop: 10, lineHeight: 1 };
  const textStyle = {
    marginBottom: 0,
    lineHeight: 1.5,
  };
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
              <Menu.Item key="/logList" style={miStyle}>
                <Link to="/logList">
                  <div style={divStyle}>
                    <CalendarOutlined style={iconStyle} />
                    <p style={textStyle}>Logs</p>
                  </div>
                </Link>
              </Menu.Item>
              <Menu.Item key="/" style={miStyle}>
                <Link to="/">
                  <div style={divStyle}>
                    <FireOutlined style={iconStyle} />
                    <p style={textStyle}>Workouts</p>
                  </div>
                </Link>
              </Menu.Item>
              <Menu.Item key="/exercises" style={miStyle}>
                <Link to="/exercises">
                  <div style={divStyle}>
                    <BookOutlined style={iconStyle} />
                    <p style={textStyle}>Exercises</p>
                  </div>
                </Link>
              </Menu.Item>
              <Menu.Item key="/settings" style={miStyle}>
                <Link to="#">
                  <div style={divStyle}>
                    <SettingOutlined style={iconStyle} />
                    <p style={textStyle}>Profile</p>
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
