const Sample = require("../models/sample");

const createSample = async (name) => {
    const sample = new Sample({ name });
    return await sample.save();
};

const getAllSamples = async () => {
    return await Sample.find();
};

module.exports = {
    createSample,
    getAllSamples,
};
