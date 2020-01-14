const signToken = require('./signToken');

//Send token to client when user is logged in.
function loggingInUsers(userId, statusCode, response, status, message){
    const token = signToken(userId);
    return response.status(statusCode).json({
        status: status,
        message: message,
        token
    });
}

module.exports = loggingInUsers;
