const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.status(201).send({message: "Bucket List App Started Successfully"});
});

module.exports = app;