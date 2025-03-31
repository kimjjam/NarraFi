// src/components/Sidebar.jsx
import "./Sidebar.scss";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("token_created_at");
        localStorage.removeItem("userId");
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="sidebar">
            <div className="logo">NarraFi</div>
            <div className="section">
                <p>일반 채널</p>
                <Link to="/chat">📢 일반 채팅</Link>
            </div>
            <div className="section">
                <p>채팅방</p>
                <Link to="/rooms">🟣 방 목록</Link>
            </div>
            <button className="logout" onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default Sidebar;
