const express = require('express');
const mongodb = require('../mongodb/mongodb.connect');

const bucketlistRoutes = require('./bucketlist-routes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const errorHandlingMiddleware = require('../controllers/errorController');

const app = express();

mongodb.connect();

app.use(express.json());

app.use('/users', bucketlistRoutes);
app.use('/auth', authRoutes);
app.use(userRoutes);


app.get('/health', (request, response) => {
    response.status(200).send({message: "Bucket List App Started Successfully"});
});

app.get("*", (request, response) => { 
    response.status(200).send({ message: "My Bucketlist Api Project" }); 
});

app.use(errorHandlingMiddleware);

module.exports = app;