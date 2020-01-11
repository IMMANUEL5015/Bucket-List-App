require('dotenv').config();
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utilities/email');

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

//Send reset token to the email address of users who have forgotten their password
exports.forgotPassword = async (request, response, next) => {
    try{
        //Step 1: Find the User based off the provided email address
        const user = await User.findOne({email: request.body.email});

        //Return an error if user is not found
        if(!user){
            return response.status(404).json({
                status: "Fail",
                message: "There is no user with that email address."
            });
        }

        //Step 2: Generate the random reset token (not JWT)
        const resetToken = crypto.randomBytes(32).toString("hex");

        //Encrypt the token and save the encrypted version to the database
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetTokenExpires = Date.now() + (1000 * 60 * 10);
        await user.save({validateBeforeSave: false});

        //Step 3: Send the unencrypted token version to the user's email

        //The url containing the token which will be sent to the user's email
        const resetURL = `${request.protocol}://${request.get('host')}/auth/resetPassword/${resetToken}`;

        //The message to be sent containing the URL
        const message = `Forgot your password? Please click on this link ${resetURL}.`;

        //Now, send the email message to the user's email address
        await sendEmail({
            email: user.email,
            subject: "Password Reset Token. Valid for only 10 Minutes!",
            message: message
        });

        //Step 4: Send a success message to the user.
        response.status(200).json({
            status: "Success",
            message: "Your reset link has been sent to your email address.",
            yourResetToken: resetToken
        });

    }catch(error){
        next(error);
    }
}

exports.resetPassword = async (request, response, next) => {
    try{
        //Step 1: Get User based on token - Remember that the token in the database is encrypted
        const hashedToken = crypto.createHash("sha256").update(request.params.token).digest('hex');
        const user = await User.findOne({passwordResetToken: hashedToken});

        //Step 2: Return an error if there is no user
        if(!user){
                return response.status(404).json({
                status: "Fail",
                message: "There is no user with that token."
            });
        }

        //Step 3: Check if token has expired and return an error if the token has expired
        const resetTokenExpiresIn = parseInt(user.passwordResetTokenExpires.getTime() / 1000, 10);
        const currentTime = parseInt(Date.now() / 1000, 10);

        if(resetTokenExpiresIn <= currentTime){
            return response.status(400).json({
                status: "Fail",
                message: "Your reset token has expired. Please request for a new reset token."
            });
        }

        //Step 4: Set the new password if no errors
        user.password = request.body.password;
        user.confirmPassword = request.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();

        // Step 5: Update the passwordChangedAt property for the user

        //Step 6: Log the user in immediately
        const token = signToken(user._id);
        response.status(200).json({
            status: 'Successful!',
            message: "Your Password Has Been Changed Successfully!",
            token
        });

    }catch(error){
        next(error);
    }
}