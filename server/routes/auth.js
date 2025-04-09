const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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

// 네이버 로그인 API 콜백 URL 처리
router.get('/naver/callback', async (req, res) => {
    const { code, state } = req.query;

    try {
        // 네이버 로그인 API에서 액세스 토큰 요청
        const tokenResponse = await axios.get('https://nid.naver.com/oauth2.0/token', {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                code: code,
                state: state,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // 네이버 사용자 정보 가져오기
        const profileResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const profile = profileResponse.data.response;
        const userId = profile.id;

        // 사용자 정보가 존재하면 JWT 발급 후 클라이언트로 리디렉션
        let user = await User.findOne({ email: profile.email });
        if (!user) {
            // 만약 존재하지 않는 유저라면 새로운 유저 생성
            user = new User({
                email: profile.email,
                password: "naver_social_login", // 비밀번호를 따로 생성하거나 설정하세요
            });
            await user.save();
        }

        // JWT 발급
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });

        // 클라이언트로 리디렉션
        res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
    } catch (error) {
        console.error("네이버 로그인 에러:", error);
        res.status(500).send("네이버 로그인 실패");
    }
});

module.exports = router;
