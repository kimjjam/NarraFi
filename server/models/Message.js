const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // 자동으로 createdAt, updatedAt 생성
});

module.exports = mongoose.model("Message", MessageSchema);
