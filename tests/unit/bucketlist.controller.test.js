//The tests, amongst other things, require the controllers, model and a fake bucketlist data
const BucketListController = require('../../server/controllers/bucketlist.controller');
const BucketList = require('../../server/models/bucketlist.model');
const httpMocks = require('node-mocks-http');
const newBucketList = require('../mock-data/unit/new-bucketlist-unit.json');


//Mock the BucketList Model methods
jest.mock('../../server/models/bucketlist.model');

//re-initialize variables before each test
let request, response, next;

//Create a fake version of the request and res objects
beforeEach(() => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = jest.fn();
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

    it("should handle errors", async () => {
        const errorMessage = {message: "Unable to create a bucketlist"};
        const rejectedPromise = Promise.reject(errorMessage);

        BucketList.create.mockReturnValue(rejectedPromise);
        await BucketListController.createBucketList(request, response, next);

        expect(next).toBeCalledWith(errorMessage);
    });
});