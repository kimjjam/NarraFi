const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    roomId: { type: String, required: true, unique: true },
    password: String, // 써도 되고 안 써도 됨
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', RoomSchema);
