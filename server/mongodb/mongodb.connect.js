const mongoose = require('mongoose');

async function connect(){
    await mongoose.connect("mongodb+srv://Immanuel50:chukaglorY55@cluster0-ggn2t.mongodb.net/bucketlist_App?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = { connect };