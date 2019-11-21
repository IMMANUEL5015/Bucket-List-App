const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect("mongodb+srv://Immanuel50:chukaglorY55@cluster0-ggn2t.mongodb.net/bucketlist_App?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch(err){
        console.log(err);
        console.log('error in connecting to mongodb');
    }
}

module.exports = { connect };