require('dotenv').config();
const mongoose = require('mongoose');

async function connect(){
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
}

module.exports = { connect };