const app = require('./server/routes/index');

app.listen(process.env.PORT || 8080, () => {
    console.log('Server is listening on port 8080');
});