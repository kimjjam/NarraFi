// src/pages/RoomChat.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import "./RoomChat.scss";

const RoomChat = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const { joinRoom, sendMessage, onMessage, onInitMessages, deleteMessage, onDeleteMessage, socket } = useContext(SocketContext);
    const userId = localStorage.getItem("userId") || `user-${Math.floor(Math.random() * 10000)}`;

    useEffect(() => {
        if (!roomId) return navigate("/rooms");

        // 핸들러 정의
        const handleInit = (msgs) => setMessages(msgs);
        const handleReceive = (msg) => setMessages((prev) => [...prev, msg]);
        const handleDeleteMessage = (deletedId) => setMessages((prev) => prev.filter((m) => m._id !== deletedId));

        // ✅ join + listener 등록
        joinRoom(roomId, userId);
        onInitMessages(handleInit);
        onMessage(handleReceive);
        onDeleteMessage(handleDeleteMessage);

        // ✅ 리스너 해제 (중복 방지)
        return () => {
            socket?.off("initMessages", handleInit);
            socket?.off("receiveMessage", handleReceive);
            socket?.off("messageDeleted", handleDeleteMessage);
        };
    }, [roomId, userId, joinRoom, onInitMessages, onMessage, onDeleteMessage, navigate, socket]);

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage({ roomId, userId, message: text.trim() });
        setText("");
    };

    const handleDelete = (id) => {
        if (window.confirm("정말 삭제할까요?")) {
            deleteMessage(id, roomId);
        }
    };

    return (
        <div className="room-chat-container">
            <div className="room-chat-header">
                <h2># {roomId}</h2>
                <button className="room-list-btn" onClick={() => navigate("/rooms")}>방 목록</button>
            </div>

            <div className="room-chat-messages">
                {messages.map((msg) => (
                    <div key={msg._id} className={`message-bubble ${msg.userId === userId ? 'my-message' : ''}`}>
                        <div className="message-user">{msg.userId}</div>
                        <div className="message-text">{msg.message}</div>
                        {msg.userId === userId && (
                            <button className="delete-btn" onClick={() => handleDelete(msg._id)}>삭제</button>
                        )}
                    </div>
                ))}
            </div>

            <div className="room-chat-input">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="메시지를 입력하세요"
                />
                <button onClick={handleSend}>전송</button>
            </div>
        </div>
    );
};

export default RoomChat;
