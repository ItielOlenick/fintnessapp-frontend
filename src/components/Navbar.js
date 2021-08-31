import { Link, useHistory, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const [user] = useAuthState(auth);
  const history = useHistory();
  const logout = () => {
    auth.signOut().then(history.push("/home"));
  };

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
          style={{ justifyContent: "center" }}
          defaultSelectedKeys={[location.pathname]}
        >
          {user ? (
            <>
              <Menu.Item key="/logList">
                <Link to="/logList">Logs</Link>
              </Menu.Item>
              <Menu.Item key="/">
                <Link to="/">Workouts</Link>
              </Menu.Item>
              <Menu.Item key="/exercises">
                <Link to="/exercises">Exercises</Link>
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
