require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL;
const CLIENT_URL = process.env.CLIENT_URL;

// ✅ MongoDB 연결
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB 연결 성공'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// ✅ 미들웨어
app.use(cors({
    origin: [
        "https://https://narrafi-front-xj3c.onrender.com",  // ✅ 프론트 도메인 정확히 등록
        "http://localhost:3000"
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ REST API
app.get('/api', (req, res) => res.json({ message: 'API is working' }));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// ✅ Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [CLIENT_URL, "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    },
    path: "/socket.io"
});

// ✅ 실시간 통신
io.on("connection", (socket) => {
    console.log("✅ 소켓 연결됨:", socket.id);

    // --- 방 참가 ---
    socket.on("joinRoom", async ({ roomId, userId }) => {
        socket.join(roomId);
        const messages = await Message.find({ roomId }).sort({ time: 1 });
        socket.emit("initMessages", messages);
    });

    // --- 메시지 전송 ---
    socket.on("sendMessage", async ({ roomId, userId, message, time }) => {
        const newMsg = new Message({ roomId, userId, message, time });
        await newMsg.save();
        io.to(roomId).emit("receiveMessage", { ...newMsg._doc });
    });

    // --- 메시지 삭제 ---
    socket.on("deleteMessage", async ({ messageId, roomId }) => {
        try {
            await Message.findByIdAndDelete(messageId);
            io.to(roomId).emit("messageDeleted", messageId);
        } catch (err) {
            console.error("❌ 메시지 삭제 실패:", err);
        }
    });

    // --- 방 생성 ---
    socket.on("createRoom", (roomName) => {
        const roomId = `${roomName}-${Date.now()}`;
        socket.join(roomId);
        socket.emit("roomCreated", { roomId, roomName });
    });

    // --- 연결 종료 ---
    socket.on("disconnect", () => {
        console.log("❌ 소켓 연결 종료:", socket.id);
    });
});

// ✅ 서버 시작
server.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
