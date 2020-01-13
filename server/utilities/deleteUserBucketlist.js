function deleteUserBucketlist(bucketlistId, userBucketlistsIds){
    for(var i = 0; i < userBucketlistsIds.length; i++){
        if(bucketlistId == userBucketlistsIds[i]){
            userBucketlistsIds.splice(i, 1);
            //End the loop once the id has been deleted
            return "Bucketlist Id has been deleted.";
        }
    }
}

module.exports = deleteUserBucketlist;