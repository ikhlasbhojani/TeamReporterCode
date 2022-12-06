import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Button, Card, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import { ContextProvider } from "../../context/context";
import classes from "./SignIn.module.css";
import { LoddingSpinnerSmall } from "../../UI/LoadingSpinner";

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUpUserWithEmailAndPassword, putData } =
    useContext(ContextProvider);

  const onFinish = (values) => {
    setIsLoading(true);
    signUpUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        putData("users/" + values.email.slice(0, -4), {
          email: values.email,
          password: values.password,
          name: values.fullName,
        });
        localStorage.setItem("email", values.email.slice(0, -4));
        localStorage.setItem("name", values.fullName);
        navigate("/teams");
        login(true);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <div className={classes.container}>
      <Card title="Sign Up" bordered={false} style={{ width: 500 }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="fullName"
            rules={[
              { required: true, message: "Please input your Full Name!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Full Name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            {isLoading ? (
              <LoddingSpinnerSmall />
            ) : (
              <>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  icon={<AiOutlineUserAdd />}
                >
                  &nbsp;Sign Up
                </Button>
                &nbsp; Or <Link to="/">Log In</Link>
              </>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
