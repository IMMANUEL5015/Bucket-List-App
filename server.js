const express = require('express');
const mongodb = require('./server/mongodb/mongodb.connect');

const bucketlistRoutes = require('./server/routes/bucketlist-routes');

const app = express();

mongodb.connect();

app.use(express.json());


app.use('/bucketlists', bucketlistRoutes);

app.get('/health', (req, res) => {
    res.status(201).send({message: "Bucket List App Started Successfully"});
});

app.get("*", (req, res) => { 
    res.status(201).send({ message: "My Bucketlist Api Project" }); 
});

var server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log('Express app is listening at port %s', port);
});

module.exports = server;