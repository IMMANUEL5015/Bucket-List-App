require('dotenv').config();
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');

//Function for generating token 
const signToken = id => {
    return jwt.sign({id: id}, process.env.SECRET , {expiresIn: '30d'});
}

//Signup user
exports.signup = async(request, response, next) => {
    try{
        const newUser = await User.create({
            username: request.body.username,
            fullName: request.body.fullName,
            email: request.body.email,
            photo: request.body.photo,
            password: request.body.password,
            confirmPassword: request.body.confirmPassword,
            passwordChangedAt: request.body.passwordChangedAt,
            bucketlists: [],
            role: request.body.role
        });

        const token = signToken(newUser._id);

        response.status(201).json({
            status: 'User has been Successfully Created',
            token,
            data: {
                user: newUser
            }
        });
    }catch(error){
        next(error);
    }
}

//Login User
exports.login = async (request, response, next) => {
    try{
        const { email, password } = request.body;

        //Error occurs when either the password or email field is empty
        if(!email || !password){
            return response.status(400).json({
                "status": "Fail",
                "message": "Please provide your email and password"
            });
        }
    
        const user = await User.findOne({email: request.body.email});
    
        //Error if user is non-existent or if password is incorrect
        if(!user ||  !(await bcrypt.compare(password, user.password) == true)){
            return response.status(401).json({
                "status": "Fail",
                "message": "Unable to verify. Please provide your correct details."
            });
        }
    
        //If verification is successful, send token is client
        const token = signToken(user._id);
        response.status(200).json({
            status: 'Success',
            token
        });
    }catch(error){
        next(error);
    }
}

//Protect routes from non-logged in users
exports.protect = async (request, response, next) => {
    try{
        //Token needs to be in the global scope for easy accessibility
        let token;
        //Step 1: Grab the token from the request header if it exists

        if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
            token = request.headers.authorization.split(' ')[1];
        } 

        //Return error if token does not exist
        if(!token){
           return response.status(401).json({
                status: "Fail",
                message: "We are unable to verify your identity. Please login to gain access"
            });
        }

        //Step 2: Verify the token if it exists
        const verified = await promisify(jwt.verify)(token, process.env.SECRET);

        //Step 3: Check if the owner of the token (the user) still exists
        const user = await User.findById(verified.id);

        //If the user does not exist, return an error
        if(!user){
            return response.status(401).json({
                status: 'Fail',
                message: "This user does not exist."
            });
        }

        //Step 4: Check if user has changed password since token was issued
            let timeWhenPasswordWasModified = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
            const timeWhenTokenWasIssued = verified.iat;
            if(timeWhenPasswordWasModified > timeWhenTokenWasIssued){
                return response.status(401).json({
                    status: "Fail",
                    message: "Your password was modified recently. Please login again."
                });
            }

        request.user = user //Useful later during authorization
        next();
    }catch(error){
        next(error);
    }
}

//User Roles and Permissions
exports.authorize = (...roles) => {
    return (request, response, next) => {
        if(!roles.includes(request.user.role)){
            return response.status(403).json({
                status: "fail",
                message: "You do not have permission to access this resource."
            });
        }
        next();
    }
}