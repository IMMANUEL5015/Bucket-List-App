const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.status(201).send({message: "Bucket List App Started Successfully"});
});

app.get("*", (req, res) => { 
    res.status(201).send({ message: "My Bucketlist Api Project" }); 
});

var server = app.listen(8080, () => {
    var port = server.address().port;
    console.log('Express app is listening at port %s', port);
});

module.exports = server;