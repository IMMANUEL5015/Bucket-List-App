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

//Update a Single Bucketlist
exports.updateBucketList =  async (request, response, next) => {
    try{
        const updatedBucketlist = await BucketList.findByIdAndUpdate(request.params.bucketlistId, request.body, {
            new: true,
            useFindAndModify: false
        });

        if(updatedBucketlist){
            response.status(200).json(updatedBucketlist);
        }else{
            response.status(404).json({
                status: "Not Found",
                message: "Unable to find a matching Bucketlist" 
            });
        }
    }catch(error){
        next(error);
    }
}