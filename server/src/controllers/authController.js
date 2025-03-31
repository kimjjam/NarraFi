const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        console.log("Received request:", req.body); // 요청 데이터 로깅
        const { email, password } = req.body;

        // 요청 데이터 검증
        if (!email || !password) {
            return res.status(400).json({ message: '이메일과 비밀번호를 입력하세요.' });
        }

        // 이메일 중복 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ message: '서버 오류', error });
    }
};

const login = async (req, res) => {
    try {
        console.log("Received request:", req.body); // 요청 데이터 로깅
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: '이메일과 비밀번호를 입력하세요.' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: '로그인 성공' });
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({ message: '서버 오류', error });
    }
};

module.exports = { register, login };
