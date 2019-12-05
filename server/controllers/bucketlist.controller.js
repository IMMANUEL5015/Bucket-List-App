const BucketList = require('../models/bucketlist.model');

exports.createBucketList = async (request, response, next) => {
   const createdBucketList = await BucketList.create(request.body);
    response.status(201).json(createdBucketList);
};