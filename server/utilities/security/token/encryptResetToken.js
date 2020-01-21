const crypto = require('crypto');

function encryptResetToken(theToken){
    return crypto.createHash('sha256').update(theToken).digest('hex');
}

module.exports = encryptResetToken;