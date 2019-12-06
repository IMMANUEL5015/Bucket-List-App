//The tests, amongst other things, require the controllers, model and a fake bucketlist data
const BucketListController = require('../../server/controllers/bucketlist.controller');
const BucketList = require('../../server/models/bucketlist.model');
const httpMocks = require('node-mocks-http');
const newBucketList = require('../mock-data/new-bucketlist.json');


//Mock the BucketList Model methods
jest.mock('../../server/models/bucketlist.model');

//re-initialize variables before each test
let request, response, next;

//Create a fake version of the req and res objects
beforeEach(() => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = null;
});

describe('BucketListController.createBucketList', () => {
    beforeEach(() => {
        request.body = newBucketList;
    });

    //function for creating a bucket list should exist.
    test('It should have a createBucketList function', () => {
        expect(typeof BucketListController.createBucketList).toBe('function');
    });

    test("Should Call BucketList.create", () => {
        //The Function for creating a bucket list should be sending valid data
        BucketListController.createBucketList(request, response, next);
        expect(BucketList.create).toBeCalledWith(newBucketList);
    });

    test("Should return a response code of 201", async () => {
        //The route should respond with data and a status code of 201
       await BucketListController.createBucketList(request, response, next);
        expect(response.statusCode).toBe(201);
        expect(response._isEndCalled()).toBeTruthy();
    });

    test("It should return json body in response", async () => {
        BucketList.create.mockReturnValue(newBucketList);
       await BucketListController.createBucketList(request, response, next);
        expect(response._getJSONData()).toStrictEqual(newBucketList);
    });
});