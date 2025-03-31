const mongoose = require("mongoose");
const sampleSchema = require("./schema");

const Sample = mongoose.model("Sample", sampleSchema);

module.exports = Sample;
