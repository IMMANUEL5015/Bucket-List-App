const request = require('supertest');
const app = require('../server.js');

describe('Test the health of my application', () => {
    test('It should respond with the message: Bucket List App Started Successfully', () => {
        return request(app).get('/health').then(response => {
            expect(response.body.message).toEqual('Bucket List App Started Successfully');
        });
    });


    test('It should be listening on Port 8080', async (done) => {
        await app.listen(8000);
        expect(app.listen()).toBeTruthy();
        done();
    });
});

    

