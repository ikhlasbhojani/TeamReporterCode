import React, { useState, useContext } from "react";
import { database, ContextProvider } from "../../context/context";
import { ref, onValue } from "firebase/database";
import classes from "./css/CreateTeam.module.css";
import { Button, Form, Input, Modal, Select } from "antd";
import { FaPlusCircle } from "react-icons/fa";
const { Option } = Select;

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          category: "development",
        }}
      >
        <Form.Item
          name="teamName"
          label="Team Name"
          rules={[
            {
              required: true,
              message: "Please input the team name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="category"
          className="collection-create-form_last-form-item"
        >
          <Select>
            <Option value="development">Development</Option>
            <Option value="sqa">SQA</Option>
            <Option value="devops">Devops</Option>
            <Option value="human resources">Human Resources</Option>
            <Option value="finance">Finance</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="membersEmail"
          label="Members (type email)"
          rules={[
            {
              required: true,
              message: "Please input the members email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CreateTeam = () => {
  const [open, setOpen] = useState(false);
  const { putData, setLoadingSpinnerIsVisible } = useContext(ContextProvider);
  const onCreate = (values) => {
    setLoadingSpinnerIsVisible(true);

    let members = [];
    const emails = values.membersEmail.split(",");
    delete values.membersEmail;

    const sendDataHandler = () => {
      const id = Math.random().toString().slice(2);
      putData(`users/${localStorage.getItem("email")}/teams/own/${id}`, {
        ...values,
        id,
        members,
      });

      members.push({
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email") + ".com",
      });

      emails.forEach((email) => {
        putData(`users/${email.slice(0, -4)}/teams/partOf/${id}`, {
          ...values,
          id,
          members,
          admin: localStorage.getItem("email") + ".com",
        });
      });
    };

    let itemsProcessed = 0;
    emails.forEach((email, index, array) => {
      onValue(
        ref(database, `users/${email.slice(0, -4)}/name`),
        (snapshot) => {
          members.push({ name: snapshot.val(), email: email });
          itemsProcessed++;
          if (itemsProcessed === array.length) {
            sendDataHandler();
          }
        },
        {
          onlyOnce: true,
        }
      );
    });

    setTimeout(() => {
      setLoadingSpinnerIsVisible(false);
    }, 2000);
    setOpen(false);
  };
  return (
    <div className={classes.btnContainer}>
      <Button
        type="primary"
        className={classes.btn}
        onClick={() => {
          setOpen(true);
        }}
        icon={<FaPlusCircle size={"26"} className={classes.icon} />}
      />
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};
export default CreateTeam;
