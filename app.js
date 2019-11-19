const express = require('express');
const app = express();

const mongoose = require('mongoose');
const url = 'mongodb+srv://Immanuel50:chukaglorY55@cluster0-ggn2t.mongodb.net/bucket-list-app?retryWrites=true&w=majority';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



app.get('*', (req, res) => {
    res.send('<h1>Page Not Found!</h1>')
});



app.listen(8080, process.env.IP, () => {
    console.log('Server is listening on Port 8080');
});