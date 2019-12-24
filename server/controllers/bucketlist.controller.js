const BucketList = require('../models/bucketlist.model');
const User = require('../models/usermodel');

//Create a new Bucketlist
exports.createBucketList = async (request, response, next) => {
    //Data Association using Object referencing
    try{
        //Create Bucketlist
        await BucketList.create({
            title: request.body.title,
            description: request.body.description,
            date_created: request.body.date_created, //Automatically Generated
            date_modified: request.body.date_modified, //Automatically Generated
            created_by: request.user.fullName //Automatically Generated
        }, async (error, newBucketlist) => {
            if(error){
                next(error);
            }else{
                //Associate the logged in user with the Bucketlist
                await User.findById(request.user._id, async(error, user) => {
                    await user.bucketlists.push(newBucketlist);
                    await user.save({validateBeforeSave: false}, (error, updatedUser) => {
                        response.status(201).json(newBucketlist);       
                    });
                });
            }   
        });
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