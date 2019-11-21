const BucketList = require('../models/bucketlist.model');

exports.createBucketList = async (req, res, next) => {
   const createdBucketList = await BucketList.create(req.body);
    res.status(201).json(createdBucketList);
};