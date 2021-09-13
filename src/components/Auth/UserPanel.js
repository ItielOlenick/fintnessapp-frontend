import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase";
import {
  Popconfirm,
  Form,
  Col,
  Row,
  Menu,
  Drawer,
  Input,
  Button,
  message,
} from "antd";
import { KeyOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import firebase from "../../services/firebase";
import { useHistory } from "react-router";
const UserPanel = () => {
  const [form] = Form.useForm();
  const [user] = useAuthState(auth);
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, values.password)
      .then(() => {
        user.updatePassword(values.newPassword).then(() => {
          message.success("Password updated successfully");
          form.resetFields();
          onClose();
        });
      })
      .catch((error) => {
        console.log(error);
        message.error("Wrong password");
      });
  };
  const history = useHistory();
  return (
    <>
      <Row>
        <Col span={24}>
          <h2>{user.displayName ? user.displayName : user.email}</h2>
          <Menu mode="vertical">
            <Menu.Item onClick={() => showDrawer()} icon={<KeyOutlined />}>
              Change Password
            </Menu.Item>
            <Popconfirm
              title="Log Out?"
              onConfirm={() => auth.signOut().then(() => history.push("/"))}
            >
              <Menu.Item onClick={() => {}} icon={<LogoutOutlined />}>
                Log Out
              </Menu.Item>
            </Popconfirm>
          </Menu>
        </Col>
      </Row>
      <Drawer
        title="Reset Password"
        placement="bottom"
        visible={visible}
        onClose={onClose}
        destroyOnClose
        height={"85vh"}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="password"
            label="Current Password"
            rules={[
              {
                required: true,
                message: "Please input your password",
              },
              { min: 6, type: "string" },
            ]}
          >
            <Input.Password style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              {
                required: true,
                message: "Please input your password",
              },
              { min: 6, type: "string" },
            ]}
          >
            <Input.Password style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("The two passwords that you entered do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <br />
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UserPanel;
