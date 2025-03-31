import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateRoom.scss";

const CreateRoom = () => {
    const [roomName, setRoomName] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!roomName.trim()) {
            return setMessage("방 이름을 입력해주세요.");
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/rooms`, {
                name: roomName
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("✅ 방 생성 성공:", response.data);
            navigate("/rooms");
        } catch (err) {
            console.error("❌ 방 생성 실패:", err.response?.data || err);
            setMessage(err.response?.data?.message || "방 생성 실패");
        }
    };

    return (
        <div className="create-room-container">
            <div className="create-room-form">
                <h2>새로운 방 만들기</h2>
                <p>참여할 채팅방을 생성하세요.</p>
                <input
                    type="text"
                    placeholder="방 이름을 입력하세요"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                {message && <span className="error">{message}</span>}
                <button onClick={handleCreate}>방 생성하기</button>
                <button className="back-btn" onClick={() => navigate("/rooms")}>돌아가기</button>
            </div>
        </div>
    );
};

export default CreateRoom;
