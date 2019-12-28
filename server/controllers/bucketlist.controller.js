const BucketList = require('../models/bucketlist.model');
const User = require('../models/usermodel');

//Create a new Bucketlist
exports.createBucketList = async (request, response, next) => {
    try{
        //Find the User who intends to create a new Bucketlist
        const user = await User.findById(request.params.userid);
        if(!user){//Error if user is unknown
            return response.status(401).json({
                message: "You are not allowed to perform this action."
            });
        }
        //Create the Bucketlist
        request.body.created_by = user.fullName;
        const bucketlist =  await BucketList.create(request.body);
        if(!bucketlist){//Error if Bucketlist is not created
            return response.status(500).json({
                message: "Failed to create Bucketlist."
            });   
        }

        //Associate the created Bucketlist with the user
        user.bucketlists.push(bucketlist);
        const updatedUser = await User.findByIdAndUpdate(request.params.userid, user, {
            new: true,
            useFindAndModify: false
        });
        if(!updatedUser){//Error if the user is not associated with the Bucketlist
            return response.status(500).json({
                message: "Failed to Associate the User with the Bucketlist."
            });
        }

        //Respond with the newly created Bucketlist
        response.status(201).json(bucketlist);
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
        const updatedBucketlist = await BucketList.findByIdAndUpdate(request.params.id, request.body, {
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

//Get a Specific Bucketlist
exports.getSpecificBucketlist = async(request, response, next) => {
    try{
        const bucketlist = await BucketList.findById(request.params.id);
        if(bucketlist){
            response.status(200).json(bucketlist);

        }else{
            response.status(404).json({
                message: "This Bucketlist does not exist."
            });
        }
    }catch(error){
        next(error);
    }  
}

//Delete a Bucketlist
exports.deleteBucketlist = async (request, response, next) => {
    try{
        const deletedBucketlist =  await BucketList.findByIdAndDelete(request.params.id);
        if(deletedBucketlist){
            response.status(200).json({message: "Bucketlist has been successfully deleted"});
        }else{
            response.status(404).json({message: "This Bucketlist does not exist."});
        }
    }catch(error){
        next(error);
    }
}