//Function for checking if a bucketlist is associated with a user
function confirmDataAssociation(bucketlistId, userBucketlists){
    let result = false;

    //Loop through all the bucketlists belonging to the user
    for(var i = 0; i < userBucketlists.length; i++){
        if(userBucketlists[i] == bucketlistId){
            result = true;
        }
        //End the loop once the association has been confirmed
        if(result == true){
            return result;
        }
    }

    //Return true if the association is confirmed and false if not.
    return result;
}

module.exports = confirmDataAssociation;