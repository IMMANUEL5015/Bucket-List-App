async function updateUser (user, id, data){
    return await user.findByIdAndUpdate(id, data, {
        new: true,
        useFindAndModify: false
    });
}

module.exports = updateUser;