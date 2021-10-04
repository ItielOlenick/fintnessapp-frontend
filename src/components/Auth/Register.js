import { Row, Col, Form, Input, Button, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import firebase from "../../services/firebase";
import UserService from "../../services/UserService";

const Register = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const onFinish = (values) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        return user
          .updateProfile({
            displayName: values.name,
          })
          .then(() => {
            UserService.create({ id: user.uid })
              .then((response) => {})
              .catch((err) => {
                console.log("error: ", err);
              });
            // Update successful
            // ...
          })
          .catch((error) => {
            // An error occurred
            // ...
          });
      })
      .then((userCredential) => {
        // Signed in

        history.push("/");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        message.warning(errorMessage);
        // ..
      });
  };

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
    },
  };
  return (
    <Row justify="center">
      <Col xs={24} sm={12}>
        <h2 style={{ textAlign: "center", margin: "0 0 50px 0" }}>Register</h2>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          {...formItemLayout}
        >
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail",
              },
              {
                required: true,
                message: "Please input your E-mail",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
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
                  if (!value || getFieldValue("password") === value) {
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Button type="primary" htmlType="submit">
              <p>Register</p>
            </Button>
          </div>
        </Form>

        <div style={{ textAlign: "center" }}>
          <p>
            Already enjoying the app? <Link to="/login">Login</Link>
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default Register;
