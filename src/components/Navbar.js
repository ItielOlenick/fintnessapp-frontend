import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { Button, Menu } from "antd";
import { useState } from "react";
import {
  UserOutlined,
  CalendarOutlined,
  FireOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [user, loading] = useAuthState(auth);

  // const ConditionalWrap = ({ condition, wrap, children }) =>
  //   condition ? wrap(children) : children;

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
      <Menu
        className="navbar-menu"
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
      >
        {loading ? (
          <></>
        ) : user ? (
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
              <Link to="/userPanel">
                <div style={divStyle}>
                  <UserOutlined style={iconStyle} />
                  <p style={textStyle}>Profile</p>
                </div>
              </Link>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="/home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/about">
              <Link to="/about">About</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </>
  );
};

export default Navbar;
