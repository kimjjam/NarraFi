import React, { useState, useEffect, useContext, useRef } from "react"; // ✅ useRef 추가
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
    const messagesEndRef = useRef(null); // ✅ 마지막 메시지 참조용

    useEffect(() => {
        if (!roomId) return navigate("/rooms");

        const handleInit = (msgs) => setMessages(msgs);
        const handleReceive = (msg) => setMessages((prev) => [...prev, msg]);
        const handleDeleteMessage = (deletedId) => setMessages((prev) => prev.filter((m) => m._id !== deletedId));

        joinRoom(roomId, userId);
        onInitMessages(handleInit);
        onMessage(handleReceive);
        onDeleteMessage(handleDeleteMessage);

        return () => {
            socket?.off("initMessages", handleInit);
            socket?.off("receiveMessage", handleReceive);
            socket?.off("messageDeleted", handleDeleteMessage);
        };
    }, [roomId, userId, joinRoom, onInitMessages, onMessage, onDeleteMessage, navigate, socket]);

    // ✅ 메시지 변경 시 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                <div ref={messagesEndRef} /> {/* ✅ 자동 스크롤 포커스용 div */}
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
