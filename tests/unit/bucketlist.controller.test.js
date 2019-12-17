//The tests, amongst other things, require the controllers, model and a fake bucketlist data
const BucketListController = require('../../server/controllers/bucketlist.controller');
const BucketList = require('../../server/models/bucketlist.model');
const httpMocks = require('node-mocks-http');
const newBucketList = require('../mock-data/unit/new-bucketlist-unit.json');
const allBucketLists = require('../mock-data/unit/all-bucketlists.json')


//Mock the BucketList Model methods
jest.mock('../../server/models/bucketlist.model');

//re-initialize variables before each test
let request, response, next;

//Simulated id for testing purposes
let id = "5def4ed3921dc21414ac979c";

//Create a fake version of the request and response objects
beforeEach(() => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = jest.fn();
});

//Tests for getting all bucketlists
describe("BucketlistController.getBucketlists", () => {
    it("should be a function", () => {
        expect(typeof BucketListController.getBucketlists).toBe('function');
    });

    it("should call Bucketlist.find({})", async () => {
        await BucketListController.getBucketlists(request, response, next);
        expect(BucketList.find).toHaveBeenCalledWith({});
    });

    it("should respond with a status code of 200 and all bucketlists", async () => {
        BucketList.find.mockReturnValue(allBucketLists);
        await BucketListController.getBucketlists(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(allBucketLists);
    });

    //error handling test for get request
    it('should handle errors correctly', async () => {
        const errorMessage = {message: "Unable to find bucketlists"};
        const rejectedPromise = Promise.reject(errorMessage);

        BucketList.find.mockReturnValue(rejectedPromise);

        await BucketListController.getBucketlists(request, response, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

//Unit tests for creating bucketlists
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

//Tests for updating a single bucketlist
describe("BucketListController.updateBucketList", () => {
    it('should be a function', () => {
        expect(typeof BucketListController.updateBucketList).toBe('function');
    });

    it("should call BucketList.FindByIdAndUpdate", async () => {
        request.params.id = id;
        request.body = newBucketList;

        await BucketListController.updateBucketList(request, response, next);
        expect(BucketList.findByIdAndUpdate).toHaveBeenCalledWith(id, newBucketList, {
            new: true,
            useFindAndModify: false
        });
    });

    it("should return a status code of 200 and json data", async () => {
        BucketList.findByIdAndUpdate.mockReturnValue(newBucketList);

        await BucketListController.updateBucketList(request, response, next);

        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(newBucketList);
    });

    it("should handle errors properly", async () => {
        const errorMessage = {message: "Unable to find and update bucketlist"};
        const rejectedPromise = Promise.reject(errorMessage);

        BucketList.findByIdAndUpdate.mockReturnValue(rejectedPromise);

        await BucketListController.updateBucketList(request, response, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    it("should return a status code of 404 if no Bucketlist is found", async () => {
        BucketList.findByIdAndUpdate.mockReturnValue(null);
        await BucketListController.updateBucketList(request, response, next);

        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Not Found",
            message: "Unable to find a matching Bucketlist"
        });
    });
});

//Tests for getting a specific bucketlist
describe("BucketListController.getSpecificBucketlist", () => {
    it("should be a function", () => {
        expect(typeof BucketListController.getSpecificBucketlist).toBe("function");
    });

    it("should call BucketList.findById with an id", async () => {
        request.params.id = id;
        await BucketListController.getSpecificBucketlist(request, response, next);
        expect(BucketList.findById).toHaveBeenCalledWith(id);
    });

    it("should respond with status code 200, and json body", async () => {
        BucketList.findById.mockReturnValue(newBucketList);
        await BucketListController.getSpecificBucketlist(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(newBucketList);
    });

    it("should handle errors", async () => {
        const errorMessage = {message: "Unable to find the bucketlist"};
        const rejectedPromise = Promise.reject(errorMessage);

        BucketList.findById.mockReturnValue(rejectedPromise);
        await BucketListController.getSpecificBucketlist(request, response, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it("should return status code 404 and error message if Bucketlist is not found", async () => {
        const errorMessage = {message: "This Bucketlist does not exist."};

        BucketList.findById.mockReturnValue(null);
        await BucketListController.getSpecificBucketlist(request, response, next);

        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(errorMessage);
    });
});