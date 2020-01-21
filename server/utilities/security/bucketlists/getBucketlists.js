async function getBucketlists (emptyArr, userBucketlists, item){
    for(var i = 0; i < userBucketlists.length; i++){
        emptyArr.push(await item.findById(userBucketlists[i]));
    }
    return emptyArr;
}

module.exports = getBucketlists;