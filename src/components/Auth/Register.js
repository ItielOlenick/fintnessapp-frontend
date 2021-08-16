import { Row, Col, Form, Input, Button, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import firebase from "../../services/firebase";

const Register = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const onFinish = (values) => {
    console.log(values);
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log(user);
        history.push("/");

        // ...
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
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  return (
    <Row justify="center" style={{ margin: "15px 0" }}>
      <Col xs={24} sm={6} style={{ padding: "10px" }}>
        <h2 style={{ textAlign: "center", margin: "50px 0" }}>Register</h2>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          {...formItemLayout}
        >
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
          <Form.Item
            wrapperCol={{
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            }}
          >
            <Button type="primary" htmlType="submit">
              <p style={{ color: "white" }}>Register</p>
            </Button>
          </Form.Item>
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
