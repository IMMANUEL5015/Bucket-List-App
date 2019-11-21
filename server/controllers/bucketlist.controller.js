const BucketList = require('../models/bucketlist.model');

exports.createBucketList = (req, res, next) => {
   const createdBucketList =  BucketList.create(req.body);
    res.status(201).json(createdBucketList);
};