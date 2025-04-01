// src/pages/Login.jsx
import "./Login.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("token_created_at", Date.now());
            localStorage.setItem("userId", email); // 그냥 userId로 이메일 사용
            navigate("/chat");
        } catch (err) {
            setMessage(err.response?.data?.message || "로그인 실패");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form">
                <h2>Welcome to NarraFi!</h2>
                <p>다시 만나니 너무 반가워요!</p>

                <label>(기수) 이름을 입력해 주세요! ex)(1기) 김재민</label>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>비밀번호</label>
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {message && <div className="error">{message}</div>}

                <button type="button" onClick={handleLogin}>로그인</button>
                <button type="button" onClick={() => navigate("/register")}>회원가입</button>
            </form>
        </div>
    );
};

export default Login;
