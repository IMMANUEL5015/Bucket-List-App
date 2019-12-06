const app = require('./server/routes/index');

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});