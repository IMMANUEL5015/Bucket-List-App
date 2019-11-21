//The tests, amongst other things, require the controllers, model and a fake bucketlist data
const BucketListController = require('../server/controllers/bucketlist.controller');
const BucketList = require('../server/models/bucketlist.model');
const httpMocks = require('node-mocks-http');
const newBucketList = require('./mock-data/new-bucketlist.json');


//Mock the BucketList Model methods
BucketList.create = jest.fn();

//re-initialize variables before each test
let req, res, next;

//Create a fake version of the req and res objects
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

describe('BucketListController.createBucketList', () => {
    beforeEach(() => {
        req.body = newBucketList;
    });

    //function for creating a bucket list should exist.
    test('It should have a createBucketList function', () => {
        expect(typeof BucketListController.createBucketList).toBe('function');
    });

    test("Should Call BucketList.create", () => {
        //The Function for creating a bucket list should be sending valid data
        BucketListController.createBucketList(req, res, next);
        expect(BucketList.create).toBeCalledWith(newBucketList);
    });

    test("Should return a response code of 201", () => {
        //The route should respond with data and a status code of 201
        BucketListController.createBucketList(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    test("It should return json body in response", () => {
        BucketList.create.mockReturnValue(newBucketList);
        BucketListController.createBucketList(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newBucketList);
    });
});