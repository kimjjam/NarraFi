import React, { useState, useEffect, useContext, useRef } from "react"; // ✅ useRef 추가
import { SocketContext } from "../contexts/SocketContext";
import "./Chat.scss";

const Chat = () => {
    const { socket, sendMessage, deleteMessage } = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const userId = localStorage.getItem("userId") || `user-${Math.floor(Math.random() * 10000)}`;
    const messagesEndRef = useRef(null); // ✅ 추가: 마지막 메시지 참조

    useEffect(() => {
        if (!socket) return;

        const handleInitMessages = (msgs) => setMessages(msgs);
        const handleReceiveMessage = (msg) => setMessages((prev) => [...prev, msg]);
        const handleMessageDeleted = (deletedId) => setMessages((prev) => prev.filter((m) => m._id !== deletedId));

        socket.on("initMessages", handleInitMessages);
        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("messageDeleted", handleMessageDeleted);

        socket.emit("joinRoom", { roomId: "general", userId });

        return () => {
            socket.off("initMessages", handleInitMessages);
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("messageDeleted", handleMessageDeleted);
        };
    }, [socket, userId]);

    // ✅ 메시지 변경 시 스크롤 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                <div ref={messagesEndRef} /> {/* ✅ 자동 스크롤 위치 */}
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
