require('dotenv').config();
const jwt = require('jsonwebtoken');

//Function for generating token 
function signToken(id){
    return jwt.sign({id: id}, process.env.SECRET , {expiresIn: '30d'});
}

module.exports = signToken;