const mongoose = require('mongoose');

const bucketListSchema =  new mongoose.Schema({
    name:{type: String, required: true}
});

const BucketList = mongoose.model('BucketList', bucketListSchema);

module.exports = BucketList;