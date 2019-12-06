require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

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

        const token = jwt.sign({id: newUser._id}, process.env.SECRET , {expiresIn: '30d'});;

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