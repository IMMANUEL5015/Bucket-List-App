const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

exports.signup = async(req, res, next) => {
    try{
        const newUser = await User.create({
            username: req.body.username,
            fullName: req.body.fullName,
            email: req.body.email,
            photo: req.body.photo,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const token = jwt.sign({id: newUser._id}, 'I-am-a-son-of-earth-and-starry-heaven' , {expiresIn: '30d'});;

        res.status(201).json({
            status: 'Success',
            token,
            data: {
                user: newUser
            }
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}