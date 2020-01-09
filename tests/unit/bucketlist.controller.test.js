//The tests, amongst other things, require the controllers, model and a fake bucketlist data
const BucketListController = require('../../server/controllers/bucketlist.controller');
const BucketList = require('../../server/models/bucketlist.model');
const httpMocks = require('node-mocks-http');
const newBucketList = require('../mock-data/unit/new-bucketlist-unit.json');
const updatedBucketList = require('../mock-data/unit/updated-bucketlist.json');
const oneUserBucketLists = require('../mock-data/unit/one-user-bucketlists-unit.json');
const allBucketLists = require('../mock-data/unit/all-bucketlists.json');
const User = require('../../server/models/usermodel');
const newUser = require('../mock-data/unit/new-user-unit.json');
const adminUser = require('../mock-data/unit/new-admin-user.json');
const userWithBucketlist = require('../mock-data/unit/user-with-bucketlist.json');
const anotherUserWithBucketlist = require('../mock-data/unit/another-user-with-bucketlists.json');


//Mock the BucketList Model methods
jest.mock('../../server/models/bucketlist.model');
jest.mock('../../server/models/usermodel');

//re-initialize variables before each test
let request, response, next;

//Simulated user id for testing purposes
let userId = "5e0225837209a11ce0a5a9ab";
let adminId = "5e143c0abeaf0d03d44b604d";

//Simulated Bucketlist id for testing purposes
let bucketlistid = "5def4ed3921dc21414ac979c";

//Create a fake version of the request and response objects
beforeEach(() => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = jest.fn();
});

//Tests for deleting a specific Bucketlist
describe("BucketlistController.deleteBucketlist", () => {
    it("should be a function", () => {
        expect(typeof BucketListController.deleteBucketlist).toBe("function");
    });

    it("should find the logged in user", async () => {
        request.params.userid = adminId;
        await BucketListController.deleteBucketlist(request, response, next);
        expect(User.findById).toHaveBeenCalledWith(adminId);
    });

    it("should return an error if user is not found", async () => {
        User.findById.mockReturnValue(null);
        await BucketListController.deleteBucketlist(request, response, next);
        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect( response._getJSONData()).toStrictEqual({
            status: "Fail",
            message: "We are unable to verify your identity."
        });
    });

    test("An admin should be able to delete any bucketlist", async () => {
        User.findById.mockReturnValue(adminUser);
        const successMessage = {message: "Bucketlist has been successfully deleted"};
        BucketList.findByIdAndDelete.mockReturnValue(newBucketList);
        await BucketListController.deleteBucketlist(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(successMessage);
    });

    it("returns an error when an admin user tries to delete a non-existent bucketlist", async () => {
        User.findById.mockReturnValue(adminUser);
        BucketList.findByIdAndDelete.mockReturnValue(null);
        await BucketListController.deleteBucketlist(request, response, next);
        expect(response.statusCode).toBe(404);
        expect(response._getJSONData()).toStrictEqual({message: "This Bucketlist does not exist."});
    });

    it("should handle errors", async () => {
        User.findById.mockReturnValue(adminUser);
        const errorMessage = {message: "An error occured in trying to find and delete the Bucketlist. Please try again."};
        const rejectedPromise = Promise.reject(errorMessage);

        BucketList.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await BucketListController.deleteBucketlist(request, response, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    
    test("regular users should be able to delete only their own associated bucketlists", async () => {
        User.findById.mockReturnValue(anotherUserWithBucketlist);
        request.params.id = anotherUserWithBucketlist.bucketlists[0];
        const successMessage = {message: "Bucketlist has been successfully deleted"};
        BucketList.findByIdAndDelete.mockReturnValue(newBucketList);
        await BucketListController.deleteBucketlist(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(successMessage);
    });

    test("error when regular users try to delete an associated non-existent bucketlist", async () => {
        User.findById.mockReturnValue(anotherUserWithBucketlist);
        request.params.id = anotherUserWithBucketlist.bucketlists[0];

        BucketList.findByIdAndDelete.mockReturnValue(null);
        await BucketListController.deleteBucketlist(request, response, next);
        expect(response.statusCode).toBe(404);
        expect(response._getJSONData()).toStrictEqual({message: "This Bucketlist does not exist."});
    });

    test("error when regular user tries to delete a bucketlist that is not their own", async () => {
        User.findById.mockReturnValue(userWithBucketlist);
        request.params.id = bucketlistid;

        BucketList.findByIdAndUpdate.mockReturnValue(newBucketList);
        await BucketListController.deleteBucketlist(request, response, next);

        expect(response.statusCode).toBe(403);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            message: "You cannot delete a bucketlist that does not belong to you."
        });
    });
});

//Tests for updating a single bucketlist
describe("BucketListController.updateBucketList", () => {
    it('should be a function', () => {
        expect(typeof BucketListController.updateBucketList).toBe('function');
    });

    it("should find the logged in user", async () => {
        request.params.userid = adminId; 
        await BucketListController.updateBucketList(request, response, next);
        expect(User.findById).toHaveBeenCalledWith(adminId);
    });

    it("should return an error if the user is not found", async () => {
        User.findById.mockReturnValue(null);
        await BucketListController.updateBucketList(request, response, next);
        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Fail",
            message: "We are unable to verify your identity."
        });
    });

    it("It should call Bucketlist.findByIdAndUpdate", async () => {
        User.findById.mockReturnValue(adminUser);
        request.params.id = bucketlistid;
        request.body = updatedBucketList;

        await BucketListController.updateBucketList(request, response, next);
        expect(BucketList.findByIdAndUpdate).toHaveBeenCalledWith(bucketlistid, updatedBucketList, {
            new: true,
            useFindAndModify: false
        });
    });

    test("An admin should be able to update any specific bucketlist", async () => {
        User.findById.mockReturnValue(adminUser);
        BucketList.findByIdAndUpdate.mockReturnValue(updatedBucketList);

        await BucketListController.updateBucketList(request, response, next);

        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(updatedBucketList);
    });

    test("error when an admin tries to update a non-existent bucketlist", async () => {
        User.findById.mockReturnValue(adminUser);
        BucketList.findByIdAndUpdate.mockReturnValue(null);
        await BucketListController.updateBucketList(request, response, next);

        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Not Found",
            message: "Unable to find a matching Bucketlist."
        });
    });

    test("Regular users can update only any of their own associated specific bucketlists", async () => {
        User.findById.mockReturnValue(userWithBucketlist);
        request.params.id = userWithBucketlist.bucketlists[0];
        BucketList.findByIdAndUpdate.mockReturnValue(updatedBucketList);

        await BucketListController.updateBucketList(request, response, next);

        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toStrictEqual(updatedBucketList);
    });

    test("error when a regular user tries to update a non-existent associated bucketlist", async () => {
        User.findById.mockReturnValue(userWithBucketlist);
        request.params.id = userWithBucketlist.bucketlists[0];

        BucketList.findByIdAndUpdate.mockReturnValue(null);
        await BucketListController.updateBucketList(request, response, next);

        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Not Found",
            message: "Unable to find a matching Bucketlist."
        });
    });

    test("error when regular user tries to update a bucketlist that is not their own", async () => {
        User.findById.mockReturnValue(userWithBucketlist);
        request.params.id = bucketlistid;

        BucketList.findByIdAndUpdate.mockReturnValue(updatedBucketList);
        await BucketListController.updateBucketList(request, response, next);

        expect(response.statusCode).toBe(403);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Fail",
            message: "You cannot update a bucketlist that does not belong to you."
        });
    });

    it("should handle errors properly", async () => {
        User.findById.mockReturnValue(adminUser);
        const errorMessage = {message: "Unable to find and update bucketlist"};
        const rejectedPromise = Promise.reject(errorMessage);

        BucketList.findByIdAndUpdate.mockReturnValue(rejectedPromise);

        await BucketListController.updateBucketList(request, response, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

//Tests for getting a specific bucketlist
describe("BucketListController.getSpecificBucketlist", () => {
    it("should be a function", () => {
        expect(typeof BucketListController.getSpecificBucketlist).toBe("function");
    });

    it("should find the logged in user", async () => {
        request.params.userid = adminId;
        await BucketListController.getSpecificBucketlist(request, response, next);
        expect(User.findById).toHaveBeenCalledWith(adminId);
    });

    it("should return an error if user is not found", async () => {
        User.findById.mockReturnValue(null);
        await BucketListController.getSpecificBucketlist(request, response, next);
        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Fail",
            message: "We are Unable to Verify Your Identity."
        });
    });
    test("An admin can get any specific Bucketlist", async () => {
        User.findById.mockReturnValue(adminUser);
        BucketList.findById.mockReturnValue(newBucketList);
        await BucketListController.getSpecificBucketlist(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(newBucketList);
    });  
    
    it("should return an error if an admin user fails to find the bucketlist", async () => {
        User.findById.mockReturnValue(adminUser);

        const errorMessage = {message: "This Bucketlist does not exist."};

        BucketList.findById.mockReturnValue(null);
        await BucketListController.getSpecificBucketlist(request, response, next);

        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(errorMessage);
    });

    test("A regular user can get any of their own associated specific Bucketlist", async () => {
        User.findById.mockReturnValue(userWithBucketlist);
        request.params.id = userWithBucketlist.bucketlists[0];
        BucketList.findById.mockReturnValue(newBucketList);
        await BucketListController.getSpecificBucketlist(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(newBucketList);
    });

    it("should return an error if a regular user fails to find the bucketlist", async () => {
        User.findById.mockReturnValue(userWithBucketlist);
        request.params.id = userWithBucketlist.bucketlists[0];

        const errorMessage = {message: "This Bucketlist does not exist."};

        BucketList.findById.mockReturnValue(null);
        await BucketListController.getSpecificBucketlist(request, response, next);

        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(errorMessage);
    });

    it("error if a regular user tries to get someone else's bucketlist", async () => {
        request.params.id = bucketlistid;
        User.findById.mockReturnValue(userWithBucketlist);

        BucketList.findById.mockReturnValue(newBucketList);
        await BucketListController.getSpecificBucketlist(request, response, next);

        expect(response.statusCode).toBe(403);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Fail",
            message: "You cannot interact with a bucketlist that does not belong to you."
        });
    })

    it("should handle errors", async () => {
        User.findById.mockReturnValue(adminUser);

        const errorMessage = {message: "Unable to find the bucketlist"};
        const rejectedPromise = Promise.reject(errorMessage);

        BucketList.findById.mockReturnValue(rejectedPromise);
        await BucketListController.getSpecificBucketlist(request, response, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

//Tests for getting all bucketlists
describe("BucketlistController.getBucketlists", () => {
    it("should be a function", () => {
        expect(typeof BucketListController.getBucketlists).toBe('function');
    });
    it("should find the user who wants to get the bucketlists", async () => {
        request.params.userid = adminId;
        await BucketListController.getBucketlists(request, response, next);
        expect(User.findById).toHaveBeenCalledWith(adminId);
    });
    it("should return an error message if user is not found", async () => {
        User.findById.mockReturnValue(null);
        await BucketListController.getBucketlists(request, response, next);
        expect(response.statusCode).toBe(404); //Not Found
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Fail",
            message: "We are unable to verify your identity."
        });
    });
    it("should retrieve all bucketlists if the user is an administrator", async () => {
        User.findById.mockReturnValue(adminUser);
        BucketList.find.mockReturnValue(allBucketLists);
        await BucketListController.getBucketlists(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(allBucketLists);
    });
    test("regular users should get only their own bucketlists", async () => {
        User.findById.mockReturnValue(userWithBucketlist);
        BucketList.findById.mockReturnValue(newBucketList);
        await BucketListController.getBucketlists(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(oneUserBucketLists);
    });

    //error handling test for get request
    it('should handle errors correctly', async () => {
        const errorMessage = {message: "Unable to find bucketlists"};
        const rejectedPromise = Promise.reject(errorMessage);

        User.findById.mockReturnValue(adminUser);
        BucketList.find.mockReturnValue(rejectedPromise);

        await BucketListController.getBucketlists(request, response, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

//Unit tests for creating bucketlists
describe('BucketListController.createBucketList', () => {
    it("should be a function", () => {
        expect(typeof BucketListController.createBucketList).toBe('function');
    });
    it("should find the user who is creating the bucketlist", async () => {
        request.params.userid = userId;
        await BucketListController.createBucketList(request, response, next);
        expect(User.findById).toHaveBeenCalledWith(userId);
    });
    it("should return an error if user is not found", async () => {
        User.findById.mockReturnValue(null);
        await BucketListController.createBucketList(request, response, next);
        expect(response.statusCode).toBe(401);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            message: "You are not allowed to perform this action."
        });
    });
    it("should call Bucketlist.create with valid data", async () => {
        request.body = newBucketList;
        User.findById.mockReturnValue(newUser);
        await BucketListController.createBucketList(request, response, next);
        expect(BucketList.create).toHaveBeenCalledWith(newBucketList);
    }); 
    it("should return an error if user fails to create the bucketlist", async () => {
        User.findById.mockReturnValue(newUser);
        BucketList.create.mockReturnValue(null);
        await BucketListController.createBucketList(request, response, next);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            message: "Failed to create Bucketlist."
        });
    });

    it("should associate the newly created Bucketlist with the user", async () => {
        request.params.userid = userId;
        User.findById.mockReturnValue(newUser);
        BucketList.create.mockReturnValue(newBucketList);
        await BucketListController.createBucketList(request, response, next);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, userWithBucketlist, {
            new : true,
            useFindAndModify: false
        });
    });

    it("should return an error if it fails to associate the user with the created bucketlist", async () => {
        User.findById.mockReturnValue(newUser);
        BucketList.create.mockReturnValue(newBucketList);
        User.findByIdAndUpdate.mockReturnValue(null);
        await BucketListController.createBucketList(request, response, next);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response.statusCode).toBe(500);
        expect(response._getJSONData()).toStrictEqual({
            message: "Failed to Associate the User with the Bucketlist."
        });
    });

    it("should respond with the newly created Bucketlist and a status code of 201, if all goes well", async () => {
        User.findById.mockReturnValue(newUser);
        BucketList.create.mockReturnValue(newBucketList);
        User.findByIdAndUpdate.mockReturnValue(userWithBucketlist);
        await BucketListController.createBucketList(request, response, next);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response.statusCode).toBe(201);
        expect(response._getJSONData()).toStrictEqual(newBucketList);
    });

    it("should handle all other kinds of error", async () => {
        User.findById.mockReturnValue(newUser);
        BucketList.create.mockReturnValue(newBucketList);
        const errorMessage = {message: "You are unable to perform this action at this time, please try again later"};
        const rejectedPromise = Promise.reject(errorMessage);
        User.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await BucketListController.createBucketList(request, response, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

