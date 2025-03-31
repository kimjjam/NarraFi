const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ✅ User 스키마 정의
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// ✅ 회원가입 시 비밀번호 자동 해싱
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ 비밀번호 비교 함수 추가 (login 때 사용할 수 있음)
UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
