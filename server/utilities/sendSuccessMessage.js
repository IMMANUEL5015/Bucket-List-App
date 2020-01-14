function sendSuccessMessage(statusCode, status, response, message){
    return response.status(statusCode).json({
        "status": status,
        "message": message
    });
}

module.exports = sendSuccessMessage;