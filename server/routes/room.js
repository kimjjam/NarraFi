const express = require('express');
const router = express.Router();
const Room = require('../models/Room'); // ✅ Room 모델 import

// ✅ 방 생성 (중복 검사 + roomId 자동 생성)
router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) return res.status(400).json({ message: "방 이름을 입력하세요." });

        // ✅ 방 이름 중복 검사
        const exists = await Room.findOne({ name });
        if (exists) return res.status(400).json({ message: "이미 존재하는 방 이름입니다." });

        // ✅ roomId 자동 생성
        const roomId = `${name}-${Date.now()}`;

        const newRoom = new Room({ name, roomId });
        await newRoom.save();

        res.status(201).json(newRoom);
    } catch (err) {
        console.error("방 생성 오류:", err);
        res.status(500).json({ error: "서버 에러로 방 생성 실패" });
    }
});

// ✅ 방 목록 조회
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });
        res.json(rooms);
    } catch (err) {
        console.error("방 목록 조회 오류:", err);
        res.status(500).json({ error: "방 목록 조회 실패" });
    }
});

// ✅ 방 삭제
router.delete('/:id', async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "방 삭제 완료" });
    } catch (err) {
        console.error("방 삭제 오류:", err);
        res.status(500).json({ error: "방 삭제 실패" });
    }
});

module.exports = router;
