require('dotenv').config();
const BucketList = require('../models/bucketlist.model');
const User = require('../models/usermodel');
const confirmDataAssociation = require('../utilities/security/bucketlists/confirmDataAssociation');
const deleteUserBucketlist = require('../utilities/security/bucketlists/deleteUserBucketlist');
const getBucketlists = require('../utilities/security/bucketlists/getBucketlists');
const update = require('../utilities/otherUtilities/update');
const sendErrorMessage = require('../utilities/otherUtilities/sendErrorMessage');
const sendSuccessMessage = require('../utilities/otherUtilities/sendSuccessMessage');

//Create a new Bucketlist - Both administrators and normal users can create a new bucketlist
exports.createBucketList = async (request, response, next) => {
    try{
        //Find the User who intends to create a new Bucketlist
        const user = request.user;
        if(!user){//Error if user is unknown
            return sendErrorMessage(Number(process.env.STATUS_CODE_401), "Fail", response, "You are not allowed to perform this action.");
        }

        //Create the Bucketlist
        request.body.created_by = user.fullName;
        const bucketlist =  await BucketList.create(request.body);
        if(!bucketlist){//Error if Bucketlist is not created
            return sendErrorMessage(Number(process.env.STATUS_CODE_500), "Fail", response, "Failed to create Bucketlist.");   
        }

        //Associate the created Bucketlist with the user
        user.bucketlists.push(bucketlist);
        const updatedUser = await update(User, request.params.userid, user);

        if(!updatedUser){//Error if the user is not associated with the Bucketlist
            return sendErrorMessage(Number(process.env.STATUS_CODE_500), "Fail", response, "Failed to Associate the User with the Bucketlist.");   
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
        let user = request.user;
    
        if(!user){//Error if no user is found
            return sendErrorMessage(Number(process.env.STATUS_CODE_404), "Fail", response, "We are unable to verify your identity.");   
        }
    
        //If the user is found:
        if(user.role == "admin"){
            //An admin user can get all the bucketlists
            allBucketlists = await BucketList.find({});
        }else{
            //Normal users can get only all of their own associated bucketlists
            await getBucketlists(allBucketlists, user.bucketlists, BucketList);            
        }
        return response.status(200).json(allBucketlists);
    }catch(error){
        next(error);
    }
};

//Update a Single Bucketlist
exports.updateBucketList =  async (request, response, next) => {
    try{
        let updatedBucketlist;
        //Step 1: Find the logged in user
        const user = request.user; 

        //Step 2: Return an error if the user is not registered with the app.
        if(!user){
            return sendErrorMessage(Number(process.env.STATUS_CODE_404), "Fail", response, "We are unable to verify your identity.");   
        }

        request.body.date_modified = Date.now();

        //Step 3: An admin should be able to update any bucketlist
        if(user.role == 'admin'){
            updatedBucketlist = await update(BucketList, request.params.id, request.body);
        }else{
            //Step 4: Regular users can update only their own associated specific bucketlist
            const associationStatus = confirmDataAssociation(request.params.id, user.bucketlists);
            if(associationStatus){
                updatedBucketlist = await update(BucketList, request.params.id, request.body);
            }else{
                //Step 5: Error when regular users try to update a bucketlist that is not theirs.
                return sendErrorMessage(Number(process.env.STATUS_CODE_403), "Fail", response, "You cannot update a bucketlist that does not belong to you.");   
            }
        }

        if(!updatedBucketlist){
            return sendErrorMessage(Number(process.env.STATUS_CODE_404), "Not Found", response, "Unable to find a matching Bucketlist.");   
        }

        return response.status(200).json(updatedBucketlist);

    }catch(error){
        next(error);
    }
}

//Get a Specific Bucketlist
exports.getSpecificBucketlist = async (request, response, next) => {
    try{
        let theBucketlist;
        //Step 1: Find the Logged in user
        const user = request.user;

        if(!user){ //Return an error if the user does not exist
            return sendErrorMessage(Number(process.env.STATUS_CODE_404), "Fail", response, "We are Unable to Verify Your Identity.");  
        }

        //Step 2: An admin user should be able to get any specific bucketlist
        if(user.role == 'admin'){
            theBucketlist = await BucketList.findById(request.params.id);
           //Step 3: A regular user should be able to get only their own associated specific bucketlist
        }else{
            const associationStatus = confirmDataAssociation(request.params.id, user.bucketlists);
            if(associationStatus){
                theBucketlist = await BucketList.findById(request.params.id);
            }else{ //Return an error if the user is not associated with the bucketlist
                return sendErrorMessage(Number(process.env.STATUS_CODE_403), "Fail", response, "You cannot interact with a bucketlist that does not belong to you.");  
            }
        } 

        if(!theBucketlist){
            return sendErrorMessage(Number(process.env.STATUS_CODE_404), "Fail", response, "This Bucketlist does not exist.");  
        }

        return response.status(200).json(theBucketlist);

    }catch(error){
        next(error);
    }  
}


//Delete a Bucketlist
exports.deleteBucketlist = async (request, response, next) => {
    try{
        let deletedBucketlist;
        //Step 1: Find the logged in user
        const user = request.user;

        //Step 2: Return an error if the user is not registered with the app
        if(!user){
            return sendErrorMessage(Number(process.env.STATUS_CODE_404), "Fail", response, "We are unable to verify your identity.");  
        }

        //Step 3: An admin user should be able to delete any bucketlist
        if(user.role == 'admin'){
            deletedBucketlist =  await BucketList.findByIdAndDelete(request.params.id);
        }else{
            //Step 4: Regular users should be able to delete only their own bucketlists
            const association = confirmDataAssociation(request.params.id, user.bucketlists);
            if(association){
                deletedBucketlist =  await BucketList.findByIdAndDelete(request.params.id);
                //Step 5: Delete the bucketlistId from the array of bucketlistsId's belonging to the user.
                deleteUserBucketlist(request.params.id, user.bucketlists);
                await update(User, request.params.userid, user);        
            }else{
                //Step 6: Return error when regular users try to delete an unassociated bucketlist
                return sendErrorMessage(Number(process.env.STATUS_CODE_403), "Fail", response, "You cannot delete a bucketlist that does not belong to you.");  
            }
        }

        if(!deletedBucketlist){
            return sendErrorMessage(Number(process.env.STATUS_CODE_404), "Fail", response, "This Bucketlist does not exist.");  
        }
        
        return sendSuccessMessage(Number(process.env.STATUS_CODE_200), "Success", response, "Bucketlist has been successfully deleted");   

    }catch(error){
        next(error);
    }
}
