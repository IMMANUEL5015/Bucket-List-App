function tokenHasExpired(tokenExpirationTime){
    const tokenExpiresIn = parseInt(tokenExpirationTime / 1000, 10);
    const currentTime = parseInt(Date.now() / 1000, 10);

    if(tokenExpiresIn <= currentTime){
        return true; //token has expired
    }else{
        return false; //token has not expired
    }
}

module.exports = tokenHasExpired;