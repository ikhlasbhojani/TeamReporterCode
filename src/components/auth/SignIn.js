import { useState, useContext } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { AiOutlineLogin } from "react-icons/ai";
import { Button, Card, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import classes from "./SignIn.module.css";
import { ContextProvider, database } from "../../context/context";
import { LoddingSpinnerSmall } from "../../UI/LoadingSpinner";
import { ref, onValue } from "firebase/database";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, signInUserWithEmailAndPassword } = useContext(ContextProvider);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setIsLoading(true);

    signInUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        localStorage.setItem("email", values.email.slice(0, -4));
        login(true);
        setIsLoading(false);
        navigate("/teams");
        onValue(
          ref(database, `users/${values.email.slice(0, -4)}/name`),
          (snapshot) => {
            localStorage.setItem("name", snapshot.val());
          },
          { onlyOnce: true }
        );
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={classes.container}>
      <Card title="Log In" bordered={false} style={{ width: 500 }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
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
                  icon={<AiOutlineLogin />}
                >
                  &nbsp;Log in
                </Button>
                &nbsp; Or <Link to="/sign-up">Sign up</Link>{" "}
              </>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
