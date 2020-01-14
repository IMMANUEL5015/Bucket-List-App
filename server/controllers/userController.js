const User = require('../models/usermodel');
const sendErrorMessage = require('../utilities/accessories/sendErrorMessage');
const sendSuccessMessage = require('../utilities/accessories/sendSuccessMessage');
const updateUser = require('../utilities/security/users/updateUser');


//Get all Users
exports.getAllUsers = async (request, response, next) => {
    try{
        //Step 1: Retrieve all the users
        const allUsers = await User.find({});

        //Step 2: Return an error if no data is rerieved
        if(!allUsers){
            return sendErrorMessage(404, "Fail", response, "No data was found.");   
        }

        //Step 3: Return all the users
        return sendSuccessMessage(200, "Success", response, allUsers);
    }catch(error){
        next(error);
    }   
}

//Get a specific user
exports.getSpecificUser = async (request, response, next) => {
    try{
        //Step 1: Find the  requested User
        const user = await User.findById(request.params.id);

        //Step 2: Return an error if the requested user does not exist.
        if(!user){
            return sendErrorMessage(404, "Fail", response, "This user does not exist.");   
        }
        //Step 3: Return the requested data if the requesting user is an admin
        if(request.user.role == 'admin'){
            return response.status(200).json(user);
        }else{
            //Step 4: Return the data if a regular user is requesting for his own data
            if(request.user.email == user.email){
                return response.status(200).json(user);
            }else{
                //Step 4: Return an error if a regular user is requesting for another user's data
                return sendErrorMessage(403, "Fail", response, "You are forbidden from interacting with this resource.");   
            }
        }
    }catch(error){
        next(error);
    } 
}

//Update a specific user's data
exports.updateUser = async (request, response, next) => {
    try{
        let updatedUser;
        //Step 1: If the logged in user is an admin, then update the user's data
        if(request.user.role == 'admin'){
            updatedUser = await updateUser(User, request.params.id, request.body);
        }else{
            //Step 2: For regular users, update the data if it belongs to them
            if(request.user._id == request.params.id){
                updatedUser = await updateUser(User, request.params.id, request.body);
            }else{
                updatedUser = false;
            }
        }

        //Step 3: Return an error if the operation failed
        if(!updatedUser){
            return sendErrorMessage(400, "Fail", response, "This operation could not be completed.");   
        }

        //Step 4: If everything goes well, return the updatedData
        response.status(200).json(updatedUser);
    }catch(error){
        next(error);
    }
}