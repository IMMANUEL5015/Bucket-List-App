const sendErrorMessage = require('../utilities/sendErrorMessage');
const sendSuccessMessage = require('../utilities/sendSuccessMessage');
const confirmDataAssociation = require('../utilities/confirmDataAssociation');
const BucketList = require('../models/bucketlist.model');
const User = require('../models/usermodel');
const deleteUserBucketlist = require('../utilities/deleteUserBucketlist');

//Create a new Bucketlist - Both administrators and normal users can create a new bucketlist
exports.createBucketList = async (request, response, next) => {
    try{
        //Find the User who intends to create a new Bucketlist
        const user = await User.findById(request.params.userid);
        if(!user){//Error if user is unknown
            return sendErrorMessage(401, "Fail", response, "You are not allowed to perform this action.");
        }

        //Create the Bucketlist
        request.body.created_by = user.fullName;
        const bucketlist =  await BucketList.create(request.body);
        if(!bucketlist){//Error if Bucketlist is not created
            return sendErrorMessage(500, "Fail", response, "Failed to create Bucketlist.");   
        }

        //Associate the created Bucketlist with the user
        user.bucketlists.push(bucketlist);
        const updatedUser = await User.findByIdAndUpdate(request.params.userid, user, {
            new: true,
            useFindAndModify: false
        });

        if(!updatedUser){//Error if the user is not associated with the Bucketlist
            return sendErrorMessage(500, "Fail", response, "Failed to Associate the User with the Bucketlist.");   
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
        let allBucketlists = [];

        //Find the user who intends to retrieve all the bucketlists
        let user = await User.findById(request.params.userid);
    
        if(!user){//Error if no user is found
            return sendErrorMessage(404, "Fail", response, "We are unable to verify your identity.");   
        }
    
        //If the user is found:
        if(user.role == "admin"){
            //An admin user can get all the bucketlists
            allBucketlists = await BucketList.find({});
            return response.status(200).json(allBucketlists);  
        }else{
            //Normal users can get only all of their own associated bucketlists
            const singleUserBucketlists = user.bucketlists;
            for(var i = 0; i < singleUserBucketlists.length; i++){
                allBucketlists.push(await BucketList.findById(singleUserBucketlists[i]));
            }
            return response.status(200).json(allBucketlists);
        }
    }catch(error){
        next(error);
    }
};

//Update a Single Bucketlist
exports.updateBucketList =  async (request, response, next) => {
    try{
        //Step 1: Find the logged in user
        const user = await User.findById(request.params.userid); 

        //Step 2: Return an error if the user is not registered with the app.
        if(!user){
            return sendErrorMessage(404, "Fail", response, "We are unable to verify your identity.");   
        }

        request.body.date_modified = Date.now();


        //Step 3: An admin should be able to update any bucketlist
        if(user.role == 'admin'){
            const updatedBucketlist = await BucketList.findByIdAndUpdate(request.params.id, request.body, {
                new: true,
                useFindAndModify: false
            });
    
            if(updatedBucketlist){
                return response.status(200).json(updatedBucketlist);
            }else{
                return sendErrorMessage(404, "Not Found", response, "Unable to find a matching Bucketlist.");   
            }
        }else{
            //Step 4: Regular users can update only their own associated specific bucketlist
            const associationStatus = confirmDataAssociation(request.params.id, user.bucketlists);
            if(associationStatus){
                const updatedBucketlist = await BucketList.findByIdAndUpdate(request.params.id, request.body, {
                    new: true,
                    useFindAndModify: false
                });
        
                if(updatedBucketlist){
                    return response.status(200).json(updatedBucketlist);
                }else{
                    return sendErrorMessage(404, "Not Found", response, "Unable to find a matching Bucketlist.");   
                }
            }else{
                //Step 5: Error when regular users try to update a bucketlist that is not theirs.
                return sendErrorMessage(403, "Fail", response, "You cannot update a bucketlist that does not belong to you.");   
            }
        }
    }catch(error){
        next(error);
    }
}

//Get a Specific Bucketlist
exports.getSpecificBucketlist = async (request, response, next) => {
    try{
        //Step 1: Find the Logged in user
        const user = await User.findById(request.params.userid);

        if(!user){ //Return an error if the user does not exist
            return sendErrorMessage(404, "Fail", response, "We are Unable to Verify Your Identity.");  
        }

        //Step 2: An admin user should be able to get any specific bucketlist
        if(user.role == 'admin'){
            const theBucketlist = await BucketList.findById(request.params.id);
            if(theBucketlist){
                return response.status(200).json(theBucketlist);

            }else{
                return sendErrorMessage(404, "Fail", response, "This Bucketlist does not exist.");  
            }
           //Step 3: A regular user should be able to get only their own associated specific bucketlist
        }else{
            const associationStatus = confirmDataAssociation(request.params.id, user.bucketlists);
            if(associationStatus){
                const bucketlist = await BucketList.findById(request.params.id);
                if(bucketlist){
                    return response.status(200).json(bucketlist);

                }else{
                    return sendErrorMessage(404, "Fail", response, "This Bucketlist does not exist.");  
                }
            }else{ //Return an error if the user is not associated with the bucketlist
                return sendErrorMessage(403, "Fail", response, "You cannot interact with a bucketlist that does not belong to you.");  
            }
        } 
    }catch(error){
        next(error);
    }  
}


//Delete a Bucketlist
exports.deleteBucketlist = async (request, response, next) => {
    try{
        //Step 1: Find the logged in user
        const user = await User.findById(request.params.userid);

        //Step 2: Return an error if the user is not registered with the app
        if(!user){
            return sendErrorMessage(404, "Fail", response, "We are unable to verify your identity.");  
        }

        //Step 3: An admin user should be able to delete any bucketlist
        if(user.role == 'admin'){
            const deletedBucketlist =  await BucketList.findByIdAndDelete(request.params.id);
            if(deletedBucketlist){
                return sendSuccessMessage(200, "Success", response, "Bucketlist has been successfully deleted");   
            }else{
                return sendErrorMessage(404, "Fail", response, "This Bucketlist does not exist.");  
            }
        }else{
            //Step 4: Regular users should be able to delete only their own bucketlists
            const association = confirmDataAssociation(request.params.id, user.bucketlists);
            if(association){
                const deletedBucketlist =  await BucketList.findByIdAndDelete(request.params.id);
                if(deletedBucketlist){
                    //Step 5: Delete the bucketlistId from the array of bucketlistsId's belonging to the user.
                    deleteUserBucketlist(request.params.id, user.bucketlists);
                    await User.findByIdAndUpdate(request.params.userid, user, {
                        useFindAndModify:false,
                        new: true
                    });
                    return sendSuccessMessage(200, "Success", response, "Bucketlist has been successfully deleted");   
                }
            }else{
                //Step 6: Return error when regular users try to delete an unassociated bucketlist
                return sendErrorMessage(403, "Fail", response, "You cannot delete a bucketlist that does not belong to you.");  
            }
        }
    }catch(error){
        next(error);
    }
}
