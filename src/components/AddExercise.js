import ExercisesService from "../services/ExercisesService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { message, Form, Input, Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const AddExercise = ({
  count,
  setCount,
  id,
  edit,
  setEdit,
  handleCancel,
  intra,
}) => {
  const [user] = useAuthState(auth);
  const [form] = Form.useForm();

  useEffect(() => {
    if (edit) {
      ExercisesService.get(id).then((data) => {
        const exercise = {
          name: data.data.name,
        };
        form.setFieldsValue(exercise);
      });
    } else {
      form.setFieldsValue({ name: "" });
      if (!intra) setEdit(false);
    }
  }, [edit]);

  const onFinish = (values) => {
    let exercise;

    if (edit) {
      exercise = { name: values.name, user: { id: user.uid }, id: id };
      ExercisesService.update(exercise)
        .then((response) => {
          message.info("exercise updated successfully");
          form.resetFields();
          setEdit(false);
          handleCancel();
        })
        .catch((error) => {
          console.log("Something went wrong", error);
        });
    } else {
      exercise = { name: values.name, user: { id: user.uid } };
      ExercisesService.create(exercise)
        .then((response) => {
          message.info("exercise added successfully");
          form.resetFields();
          setCount(count + 1);
        })
        .catch((error) => {
          console.log("Something went wrong", error);
        });
    }
  };
  return (
    <Form form={form} onFinish={onFinish} layout="inline">
      <Form.Item
        style={{ width: "80%" }}
        className="mobileInput"
        name="name"
        label="Exercise Name"
        rules={[{ required: true, message: "Name required" }]}
      >
        <Input id="name" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="mobileButton">
          {edit ? "update" : "save"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddExercise;
