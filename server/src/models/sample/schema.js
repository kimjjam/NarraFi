const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = sampleSchema;
