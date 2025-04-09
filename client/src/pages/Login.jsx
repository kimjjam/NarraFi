import "./Login.scss";
import React, { useState, useEffect } from "react";
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

    // 네이버 로그인 처리
    const handleNaverLogin = () => {
        // 네이버 로그인 페이지로 리디렉션
        const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
        const redirectUri = `${process.env.REACT_APP_CLIENT_URL}/auth/naver/callback`;
        const state = Math.random().toString(36).substring(2); // 임의의 state 값
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

        // URL로 리디렉션
        window.location.href = naverAuthUrl;
    };

    // 네이버 로그인 후 토큰 처리
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/chat");  // 로그인 후 채팅 페이지로 이동
        }
    }, [navigate]);

    return (
        <div className="login-container">
            <form className="login-form">
                <h2>Welcome to NarraFi!</h2>
                <p>다시 만나니 너무 반가워요!</p>

                <label>[기수] 이름을 입력해 주세요!                    ex) [1기] 김재민</label>
                <input
                    type="email"
                    placeholder="[기수] 이름을 입력해 주세요!"
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
                
                {/* 네이버 로그인 버튼 추가 */}
                <button type="button" onClick={handleNaverLogin} className="naver-login-btn">
                    네이버 로그인
                </button>
            </form>
        </div>
    );
};

export default Login;
