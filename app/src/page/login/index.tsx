import logo from "../../assets/logo.webp";
import bg from "../../assets/bg.webp";
import lgbg from "../../assets/lgbg.webp";
import "./index.scss";
import { Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../../api/users";
import { setToken } from "../../store/login/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // preload 提示浏览器优先下载背景图
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = lgbg;
    document.head.appendChild(preloadLink);

    const img = new Image();
    img.setAttribute("fetchpriority", "high");
    img.src = lgbg;
    img.onload = () => setBgReady(true);
  }, []);

  const handleLogin = () => {
    form
      .validateFields()
      .then(async (res) => {
        setLoading(true);
        const {
          data: { token, username, btnAuth },
        } = await login(res);
        setLoading(false);
        dispatch(setToken(token));
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("btnAuth", JSON.stringify(btnAuth));
        navigate("/", { replace: true });
      })
      .catch(() => setLoading(false));
  };

  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="lgbg"
        style={{
          backgroundImage: bgReady ? `url(${lgbg})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!bgReady && <div className="skeleton-bg"></div>}
        <div className="part">
          <div className="title">
            <div className="logo">
              {/* fetchpriority 提示浏览器尽早加载 logo */}
              <img src={logo} width={140} alt="logo" fetchPriority="high" />
            </div>
            <h1 className="main-title">NeoPark智慧园区</h1>
          </div>
          <Form form={form}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "用户名不能为空" },
                {
                  pattern: /^\w{4,8}$/,
                  message: "用户名必须是4-8位数字字母组合",
                },
              ]}
            >
              <Input placeholder="请输入您的用户名" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "密码不能为空" }]}
            >
              <Input.Password
                placeholder="请输入您的密码"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={handleLogin}
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
