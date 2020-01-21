const bcrypt = require('bcryptjs');

async function confirmExistingPassword(confirmOldPassword, oldPassword){
    return await bcrypt.compare(confirmOldPassword, oldPassword);
}

module.exports = confirmExistingPassword;