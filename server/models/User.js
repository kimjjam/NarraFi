const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ✅ User 스키마 정의
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // 비밀번호 필드는 네이버 로그인 시 없을 수 있음
    naverId: { type: String, unique: true }, // 네이버 로그인 시 고유 ID 추가
}, { timestamps: true });

// ✅ 회원가입 시 비밀번호 자동 해싱 (비밀번호가 있을 경우에만)
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10); // 비밀번호 해싱
    }
    next();
});

// ✅ 비밀번호 비교 함수 추가 (로그인 때 사용할 수 있음)
UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
