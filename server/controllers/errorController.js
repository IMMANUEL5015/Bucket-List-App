module.exports = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    //JWT error handling
    if(error.name == 'JsonWebTokenError' || error.name == 'TokenExpiredError'){
        error.statusCode = 401;
        error.status = 'Fail',
        error.message = "You are unable to interact with this resource. Please login again."
    }

    response.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
};