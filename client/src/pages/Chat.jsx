import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import "./Chat.scss";

const Chat = () => {
    const { socket, sendMessage, deleteMessage } = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const userId = localStorage.getItem("userId") || `user-${Math.floor(Math.random() * 10000)}`;

    useEffect(() => {
        if (!socket) return;

        // ✅ 반드시 리스너 먼저 등록
        const handleInitMessages = (msgs) => setMessages(msgs);
        const handleReceiveMessage = (msg) => setMessages((prev) => [...prev, msg]);
        const handleMessageDeleted = (deletedId) => setMessages((prev) => prev.filter((m) => m._id !== deletedId));

        socket.on("initMessages", handleInitMessages);
        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("messageDeleted", handleMessageDeleted);

        // ✅ joinRoom은 맨 마지막에 호출 (순서 중요)
        socket.emit("joinRoom", { roomId: "general", userId });

        // ✅ cleanup
        return () => {
            socket.off("initMessages", handleInitMessages);
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("messageDeleted", handleMessageDeleted);
        };
    }, [socket, userId]);

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage({ roomId: "general", userId, message: text });
        setText("");
    };

    const handleDelete = (id) => {
        if (window.confirm("정말 삭제할까요?")) {
            deleteMessage(id, "general");
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2># 일반 채팅</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg._id} className={`message-bubble ${msg.userId === userId ? "my-message" : ""}`}>
                        <div className="message-user">{msg.userId}</div>
                        <div className="message-text">{msg.message}</div>
                        {msg.userId === userId && (
                            <button className="delete-btn" onClick={() => handleDelete(msg._id)}>삭제</button>
                        )}
                    </div>
                ))}
            </div>
            <div className="chat-input">
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

export default Chat;
