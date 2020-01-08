const BucketList = require('../models/bucketlist.model');
const User = require('../models/usermodel');

//Function for checking if a bucketlist is associated with a user
function confirmDataAssociation(bucketlistId, userBucketlists){
    let result = false;

    //Loop through all the bucketlists belonging to the user
    for(var i = 0; i < userBucketlists.length; i++){
        if(userBucketlists[i] == bucketlistId){
            result = true;
        }
    }

    //Return true if the association is confirmed and false if not.
    return result;
}

//Create a new Bucketlist - Both administrators and normal users can create a new bucketlist
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
        let allBucketlists = [];

        //Find the user who intends to retrieve all the bucketlists
        let user = await User.findById(request.params.userid);
    
        if(!user){//Error if no user is found
            return response.status(404).json({ 
                status: "Fail",
                message: "We are unable to verify your identity."
            });
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
            return response.status(404).json({
                status: "Fail",
                message: "We are unable to verify your identity."
            });
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
                return response.status(404).json({
                    status: "Not Found",
                    message: "Unable to find a matching Bucketlist." 
                });
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
                    return response.status(404).json({
                        status: "Not Found",
                        message: "Unable to find a matching Bucketlist." 
                    });
                }
            }else{
                //Step 5: Error when regular users try to update a bucketlist that is not theirs.
                return response.status(403).json({
                    status: "Fail",
                    message: "You cannot update a bucketlist that does not belong to you."
                });
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
            return response.status(404).json({
                status: "Fail",
                message: "We are Unable to Verify Your Identity."
            });
        }

        //Step 2: An admin user should be able to get any specific bucketlist
        if(user.role == 'admin'){
            const theBucketlist = await BucketList.findById(request.params.id);
            if(theBucketlist){
                return response.status(200).json(theBucketlist);

            }else{
                return response.status(404).json({
                    message: "This Bucketlist does not exist."
                });
            }
           //Step 3: A regular user should be able to get only their own associated specific bucketlist
        }else{
            const associationStatus = confirmDataAssociation(request.params.id, user.bucketlists);
            if(associationStatus){
                const bucketlist = await BucketList.findById(request.params.id);
                if(bucketlist){
                    return response.status(200).json(bucketlist);

                }else{
                    return response.status(404).json({
                        message: "This Bucketlist does not exist."
                    });
                }
            }else{ //Return an error if the user is not associated with the bucketlist
                return response.status(403).json({
                    status: "Fail",
                    message: "You cannot interact with a bucketlist that does not belong to you."
                });
            }
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
