const User = require('../models/usermodel');
const sendErrorMessage = require('../utilities/accessories/sendErrorMessage');
const sendSuccessMessage = require('../utilities/accessories/sendSuccessMessage');

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