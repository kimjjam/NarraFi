// src/contexts/SocketContext.js
import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = io(process.env.REACT_APP_SOCKET_URL, {
            transports: ["websocket"],
            path: "/socket.io",
        });
        setSocket(s);

        return () => s.disconnect();
    }, []);

    // ✅ 방 입장
    const joinRoom = (roomId, userId) => {
        socket?.emit("joinRoom", { roomId, userId });
    };

    // ✅ 메세지 전송
    const sendMessage = ({ roomId, userId, message }) => {
        socket?.emit("sendMessage", { roomId, userId, message, time: new Date() });
    };

    // ✅ 초기 메세지 수신
    const onInitMessages = (callback) => {
        socket?.on("initMessages", callback);
    };

    // ✅ 실시간 메세지 수신
    const onMessage = (callback) => {
        socket?.on("receiveMessage", callback);
    };

    // ✅ 메세지 삭제 요청
    const deleteMessage = (messageId, roomId) => {
        socket?.emit("deleteMessage", { messageId, roomId });
    };

    // ✅ 메세지 삭제 수신 (이벤트명 수정됨)
    const onDeleteMessage = (callback) => {
        socket?.on("messageDeleted", callback);
    };

    return (
        <SocketContext.Provider value={{
            socket,
            joinRoom,
            sendMessage,
            onInitMessages,
            onMessage,
            deleteMessage,
            onDeleteMessage,
        }}>
            {children}
        </SocketContext.Provider>
    );
};
