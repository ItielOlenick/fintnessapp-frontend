import { Link, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { Menu, Layout, Row, Col } from "antd";
import { useEffect, useState } from "react";
const { Header } = Layout;

const Navbar = () => {
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

  const [user] = useAuthState(auth);
  const history = useHistory();
  const logout = () => {
    auth.signOut().then(history.push("/home"));
  };

  const ConditionalWrap = ({ condition, wrap, children }) =>
    condition ? wrap(children) : children;

  return (
    <>
      <Row justify="center">
        <Col sm={10} xs={24}>
          {/* <div style={{ maxWidth: 800, margin: "0 auto" }}> */}
          {user ? (
            <div className="sameRow" style={{ padding: "0 10px" }}>
              <p>
                {
                  (user.displayName,
                  user.displayName ? user.displayName : user.email)
                }
              </p>
              <Link onClick={logout}>Logout</Link>
            </div>
          ) : (
            <></>
          )}
        </Col>
      </Row>
      <ConditionalWrap
        condition={width > 600}
        wrap={(children) => <Header>{children}</Header>}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ justifyContent: "center" }}
          // defaultSelectedKeys={["1"]}
        >
          {user ? (
            <>
              <Menu.Item>
                <Link to="/">Log</Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link to="/">Workouts</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/exercises">Exercises</Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="1">
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
