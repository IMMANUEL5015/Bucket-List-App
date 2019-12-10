const BucketList = require('../models/bucketlist.model');

exports.createBucketList = async (request, response, next) => {
    try{
        const createdBucketList = await BucketList.create(request.body);
        response.status(201).json(createdBucketList);
    }catch(error){
        next(error);
    }
};