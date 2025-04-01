import "./Register.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            return setMessage("비밀번호가 일치하지 않습니다.");
        }
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, { email, password });
            navigate("/");
        } catch (err) {
            setMessage(err.response?.data?.message || "회원가입 실패");
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>회원가입</h2>
                <p>계정을 만들어 대화에 참여하세요</p>
                <input
                    type="email"
                    placeholder="[기수] 이름                    ex) [1기] 김재민"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {message && <p className="error">{message}</p>}
                <button onClick={handleRegister}>회원가입</button>
                <button className="link" onClick={() => navigate("/")}>로그인으로 돌아가기</button>
            </div>
        </div>
    );
};

export default Register;
