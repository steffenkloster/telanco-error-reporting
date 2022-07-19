const mongoose = require("mongoose");
const axios = require('axios');

const tErrorSchema = mongoose.Schema({
    date: {
        type: Date,
        default: () => Date.now()
    },

    website: String,
    tags: [String],
    ip: String,

    filename: String,
    errorType: {
        type: String,
        default: 'ERROR'
    },
    errorMessage: String,
    stackTrace: String,
    userAgent: String,
    countryCode: String
});

const TError = mongoose.model('TError', tErrorSchema);

module.exports = {
    async newError(req, err) {
        err.ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const res = await axios.get('http://ip-api.com/json/' + err.ip);
        const resJson = await res.json();
        err.countryCode = resJson.countryCode;

        return await new TError(err).save();
    },

    async getAllErrors() {
        return await TError.find({});
    },

    async deleteAll() {
        return await TError.deleteMany({});
    }

    /*
    async createUser() {
        let alias;
        while(!alias) {
            const a = generateAlias();
            if(!(await this.aliasExists(a))) {
                alias = a;
            }
        }

        console.log(`Creating ${alias}`);
        return await new User({ alias }).save();
    },

    async getUser(_id) {
        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return null;
        }
        
        return await User.findById(_id);
    },

    async getDosage(_id) {
        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return null;
        }
        
        return await User.findOne({ 'rides.dosages._id' : _id });
    },

    async changeDosage(_id, dosage) {
        return await User.updateMany({},
            { $set: { 'rides.$[].dosages.$[d].dose': dosage } },
            { arrayFilters: [{ 'd._id': _id }] });
    },

    async changeDosageTime(_id, time) {
        return await User.updateMany({},
            { $set: { 'rides.$[].dosages.$[d].time': time } },
            { arrayFilters: [{ 'd._id': _id }] });
    },

    async aliasExists(alias) {
        return await User.findOne({ alias: { $regex : new RegExp(alias, "i") } });
    },

    // not working
    async getCurrentTrainRide(_id) {
        return await User.aggregate([
            { $project: { id: 1, rides: { $slice: [ "$rides", -1 ] } } },
            { $match: { _id } }
         ]);
    },

    async startNewTrainRide(_id) {
        return await User.findOneAndUpdate(
            { _id }, 
            { $push: {
                rides: {
                    startTime: new Date().toISOString(),
                    dosages: []
                }
            } }
        );
    },

    async setAlias(_id, alias) {
        return await User.findOneAndUpdate(
            { _id },
            { alias }
        );
    }
    */
};
