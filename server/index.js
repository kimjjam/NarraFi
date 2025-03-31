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

// ✅ CORS 설정 (render + localhost 둘 다 허용)
app.use(cors({

    origin: [CLIENT_URL, "http://localhost:3000"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ REST API 라우터
app.get('/api', (req, res) => res.json({ message: 'API is working' }));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// ✅ http 서버 생성 (⚠️ socket 전에 필수)
const server = http.createServer(app);
// ✅ Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    },
    path: "/socket.io"
});


// ✅ 실시간 통신
io.on("connection", (socket) => {
    console.log("✅ 소켓 연결됨:", socket.id);

    socket.on("joinRoom", async ({ roomId, userId }) => {
        socket.join(roomId);
        const messages = await Message.find({ roomId }).sort({ time: 1 });
        socket.emit("initMessages", messages);
    });

    socket.on("sendMessage", async ({ roomId, userId, message, time }) => {
        const newMsg = new Message({ roomId, userId, message, time });
        await newMsg.save();
        io.to(roomId).emit("receiveMessage", { ...newMsg._doc });
    });

    socket.on("deleteMessage", async ({ messageId, roomId }) => {
        try {
            await Message.findByIdAndDelete(messageId);
            io.to(roomId).emit("messageDeleted", messageId);
        } catch (err) {
            console.error("❌ 메시지 삭제 실패:", err);
        }
    });

    socket.on("createRoom", (roomName) => {
        const roomId = `${roomName}-${Date.now()}`;
        socket.join(roomId);
        socket.emit("roomCreated", { roomId, roomName });
    });

    socket.on("disconnect", () => {
        console.log("❌ 소켓 연결 종료:", socket.id);
    });
});

// ✅ 서버 시작
server.listen(PORT, () => {
    console.log(`✅ 서버 실행 중 (PORT: ${PORT})`);
});
