async function update (item, id, data){
    return await item.findByIdAndUpdate(id, data, {
        new: true,
        useFindAndModify: false
    });
}

module.exports = update;