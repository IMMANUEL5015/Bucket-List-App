const request = require('supertest');
const app = require('../../server/routes/index');

describe('Testing express application', () => { 
    test('health endpoint responds with: Bucket List App Started Successfully', () => {
        return request(app).get('/health').then(response => {
            expect(response.body.message).toEqual('Bucket List App Started Successfully');
        });
    });

    test('unmatched route should respond with: My Bucketlist Api Project', () => {
        return request(app).get('/').then(response => {
            expect(response.body.message).toEqual('My Bucketlist Api Project');
        });
    });

    test('another unmatched route should respond with: My Bucketlist Api Project', () => {
        return request(app).get('/nothing').then(response => {
            expect(response.body.message).toEqual('My Bucketlist Api Project');
        });
    });
});
 

