require('dotenv').config();
const User = require('../models/usermodel');
const loggingInUsers = require('../utilities/security/token/loggingInUsers');
const sendErrorMessage = require('../utilities/otherUtilities/sendErrorMessage');
const sendSuccessMessage = require('../utilities/otherUtilities/sendSuccessMessage');
const update = require('../utilities/otherUtilities/update');
const confirmExistingPassword = require('../utilities/security/users/confirmExistingPassword');
const status = require('../../config');

//Get all Users
exports.getAllUsers = async (request, response, next) => {
    try{
        //Step 1: Retrieve all the users
        const allUsers = await User.find({});

        //Step 2: Return an error if no data is rerieved
        if(!allUsers){
            return sendErrorMessage(status.not_found, "Fail", response, "No data was found.");   
        }

        //Step 3: Return all the users
        return sendSuccessMessage(status.ok, "Success", response, allUsers);
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
            return sendErrorMessage(status.not_found, "Fail", response, "This user does not exist.");   
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
                return sendErrorMessage(status.forbidden, "Fail", response, "You are forbidden from interacting with this resource.");   
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
            updatedUser = await update(User, request.params.id, request.body);
        }else{
            //Step 2: For regular users, update the data if it belongs to them
            if(request.user._id == request.params.id){
                updatedUser = await update(User, request.params.id, request.body);
            }else{
                updatedUser = false;
            }
        }

        //Step 3: Return an error if the operation failed
        if(!updatedUser){
            return sendErrorMessage(status.bad_request, "Fail", response, "This operation could not be completed.");   
        }

        //Step 4: If everything goes well, return the updatedData
        response.status(200).json(updatedUser);
    }catch(error){
        next(error);
    }
}

//Update user password
exports.updateUserPassword = async (request, response, next) => {
    const user = request.user; //The logged in user

    //Step 1: Error if a  logged in user attempts to change another user's password
    if(user._id != request.params.id){
        return sendErrorMessage(status.forbidden, "Fail", response, "You are not allowed to perform this action.");   
    }

    //Step 2: Error if the user does not know the existing password
    const passwordIsCorrect = await confirmExistingPassword(request.body.currentPassword, user.password);
    if(!passwordIsCorrect){
        return sendErrorMessage(status.bad_request, "Incorrect Data", response, "Please enter the existing password.");   
    }
    //Step 3: Replace the old password with the new one
    user.password = request.body.newPassword;
    user.confirmPassword = request.body.confirmNewPassword;
    await user.save();

    //Step 4: Log the user in
    return loggingInUsers(user._id, status.ok, response,'Success', 'You are now logged into the application.');
}

//Delete a specific user
exports.deleteUser = async (request, response, next) => {
    try{
        let deletedUser;
        //Step 1: An admin should be able to delete any user
        if(request.user.role == 'admin'){
            deletedUser = await User.findByIdAndDelete(request.params.id);
        }else{
            //Step 2: A regular user should be able to delete only their own account
            if(request.user._id == request.params.id){
                deletedUser = await User.findByIdAndDelete(request.params.id);
            }else{
                deletedUser = false;
            }
        }
    
        //Step 3: Return an error if the operation was not successful
        if(!deletedUser){
            return sendErrorMessage(status.bad_request, "Fail", response, "This operation could not be completed.");   
        }
    
        //Step 4: Return a success message if the operation goes smoothly
        return sendSuccessMessage(status.ok, "Success", response, "This account has been successfully deleted.");
    }catch(error){
        next(error);
    }
}