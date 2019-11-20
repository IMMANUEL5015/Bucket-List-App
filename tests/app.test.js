const request = require('supertest');
const app = require('../server/app');

describe('Test the health of my application', () => {
    test('It should respond with the message: Bucket List App Started Successfully', () => {
        return request(app).get('/health').then(response => {
            expect(response.body.message).toEqual('Bucket List App Started Successfully');
        });
    });
});

describe('Test unmatched route', () => {
    test('it should respond with the message: My Bucketlist Api Project', () => {
        return request(app).get('/').then(response => {
            expect(response.body.message).toEqual('My Bucketlist Api Project');
        });
    });
});  

