const BucketList = require('../models/bucketlist.model');

//Create a new Bucketlist
exports.createBucketList = async (request, response, next) => {
    try{
        const createdBucketList = await BucketList.create(request.body);
        response.status(201).json(createdBucketList);
    }catch(error){
        next(error);
    }
};

//Get all Bucketlists
exports.getBucketlists = async (request, response, next) => {
    try{
        const allBucketlists = await BucketList.find({});
        response.status(200).json(allBucketlists);
    }catch(error){
        next(error);
    }
};