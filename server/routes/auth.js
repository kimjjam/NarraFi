const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 회원가입 API
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 중복 체크
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
        }

        // 유저 생성 (User.js의 pre-save 훅이 자동으로 비밀번호를 해싱함)
        const newUser = new User({ email, password });
        await newUser.save();

        res.status(201).json({ message: "회원가입 성공" });
    } catch (error) {
        console.error("회원가입 에러:", error);
        res.status(500).json({ error: "서버 에러 발생" });
    }
});

// 로그인 API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.USE_SSL === "true",
            sameSite: "Lax",
            maxAge: 1000 * 60 * 60
        });

        res.status(200).json({ message: "로그인 성공" });

    } catch (error) {
        console.error("로그인 에러:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

module.exports = router;
