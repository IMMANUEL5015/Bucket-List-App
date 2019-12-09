require('dotenv').config();
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
            confirmPassword: request.body.confirmPassword
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