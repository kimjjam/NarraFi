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
const axios = require('axios'); // 네이버 API 연동을 위한 axios 추가

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_REDIRECT_URI = process.env.NAVER_REDIRECT_URI;

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

// ✅ 네이버 로그인 API
app.get('/auth/redirect', async (req, res) => {
    try {
        const code = req.query.code;
        const { data } = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
            params: {
                client_id: NAVER_CLIENT_ID,
                client_secret: NAVER_CLIENT_SECRET,
                code: code,
                redirect_uri: NAVER_REDIRECT_URI,
                grant_type: 'authorization_code'
            }
        });

        const { access_token } = data;
        const profileData = await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const { id, email } = profileData.data.response;

        // 로그인 처리 (아이디로 유저 생성 또는 로그인)
        let user = await User.findOne({ email });
        if (!user) {
            // 유저가 없으면 새로운 유저 생성
            user = new User({ email, password: '', naverId: id });
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.USE_SSL === "true",
            sameSite: "Lax",
            maxAge: 1000 * 60 * 60
        });

        res.redirect(CLIENT_URL); // 네이버 로그인 후 클라이언트로 리디렉션
    } catch (err) {
        console.error("❌ 네이버 로그인 에러:", err);
        res.status(500).json({ message: "로그인 실패" });
    }
});

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
