require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



app.get('/health', (req, res) => { 
    res.status(201).send({ message: 'App started successfully'}); 
});

app.get("*", (req, res) => { 
    res.status(201).send({ message: "My Bucketlist Api" }); 
});



app.listen(8080, () => {
    console.log('Server is listening on Port 8080');
});