const request = require('supertest');

describe('Testing express application', () => {
    let server;

    beforeEach( () => {
        server = require('../server.js');
    });

    afterEach(() => {
        server.close();
    });

    test('health endpoint responds with: Bucket List App Started Successfully', () => {
        return request(server).get('/health').then(response => {
            expect(response.body.message).toEqual('Bucket List App Started Successfully');
        });
    });

    test('unmatched route should respond with: My Bucketlist Api Project', () => {
        return request(server).get('/').then(response => {
            expect(response.body.message).toEqual('My Bucketlist Api Project');
        });
    });

    test('another unmatched route should respond with: My Bucketlist Api Project', () => {
        return request(server).get('/nothing').then(response => {
            expect(response.body.message).toEqual('My Bucketlist Api Project');
        });
    });
});
 

