const userController = require('../../server/controllers/userController');
const User = require('../../server/models/usermodel');
const httpMocks = require('node-mocks-http');
const allUsers = require('../mock-data/unit/users/allUsers.json');
const adminUser = require('../mock-data/unit/users/new-admin-user.json');
const newUser = require('../mock-data/unit/users/new-user-unit.json');
const user = require('../mock-data/unit/users/user.json');

jest.mock('../../server/models/usermodel');

let request, response, next;

beforeEach(() => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = jest.fn();
});

let userid = "5e143c0abeaf0d03d44b604d";

//Tests for getting all users data
describe("userController.getAllUsers", () => {
    it("should be a function", () => {
        expect(typeof userController.getAllUsers).toBe('function');
    });

    it("should call User.find({})", async () => {
        await userController.getAllUsers(request, response, next);
        expect(User.find).toHaveBeenCalledWith({});
    });

    it("should return an error if no data is retrieved", async () => {
        User.find.mockReturnValue(null);
        await userController.getAllUsers(request, response, next);
        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            "status": "Fail",
            "message": "No data was found."
        }); 
    });

    it("should return a success message, and an array containing all the users data", async () => {
        User.find.mockReturnValue(allUsers);
        await userController.getAllUsers(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            "status": "Success",
            "message": allUsers
        }); 
    });

    it("should handle promise rejection errors", async () => {
        const errorMessage = {message: "An error occured! Please try again."};
        const rejectedPromise = Promise.reject(errorMessage);

        User.find.mockReturnValue(rejectedPromise);
        await userController.getAllUsers(request, response, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

//Tests for getting a specific user
describe("userController.getSpecificUser", () => {
    it("should be a function", () => {
        expect(typeof userController.getSpecificUser).toBe('function');
    });

    it("should call User.findById", async () => {
        request.params.id = userid;
        await userController.getSpecificUser(request, response, next);
        expect(User.findById).toHaveBeenCalledWith(userid);
    });

    it("should return an error if the user does not exist", async () => {
        User.findById.mockReturnValue(null);
        await userController.getSpecificUser(request, response, next);
        expect(response.statusCode).toBe(404);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            "status": "Fail",
            "message": "This user does not exist."
        }); 
    });

    it("should return the user data if the requesting user is an admin", async () => {
        request.user = adminUser;
        User.findById.mockReturnValue(adminUser);
        await userController.getSpecificUser(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(adminUser);
    });

    test("error if a regular user is requesting for another user's data", async () => {
        request.user = user;
        User.findById.mockReturnValue(newUser);
        await userController.getSpecificUser(request, response, next);
        expect(response.statusCode).toBe(403);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Fail",
            message: "You are forbidden from interacting with this resource."
        });
    });

    it("Return the data if a regular user is requesting for his own data", async () => {
        request.user = user;
        User.findById.mockReturnValue(user);
        await userController.getSpecificUser(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(user);
    });

    it("should handle promise rejection errors", async () => {
        const errorMessage = {message: "An error occured! Please try again."};
        const rejectedPromise = Promise.reject(errorMessage);

        User.findById.mockReturnValue(rejectedPromise);
        await userController.getSpecificUser(request, response, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

//Tests for updating a specific user's data
describe("userController.updateUser", () => {
    it("should be a function", () => {
        expect(typeof userController.updateUser).toBe('function');
    });

    it("An admin can update any user's data", async () => {
        request.user = adminUser;
        User.findByIdAndUpdate.mockReturnValue(user); //regular user
        await userController.updateUser(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(user);
    });

    it("A regular user can update only their own data", async () => {
        request.user = user;
        request.params.id = user._id;
        User.findByIdAndUpdate.mockReturnValue(user); //regular user
        await userController.updateUser(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual(user);
    });

    it("should return an error if the user data is not updated", async () => {
        request.user = user;
        request.params.id = adminUser._id;
        User.findByIdAndUpdate.mockReturnValue(adminUser);
        await userController.updateUser(request, response, next);
        expect(response.statusCode).toBe(400);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            "status": "Fail",
            "message": "This operation could not be completed."
        }); 
    });

    it("should handle promise rejection errors", async () => {
        request.user = adminUser;
        const errorMessage = {message: "An error occured! Please try again."};
        const rejectedPromise = Promise.reject(errorMessage);

        User.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await userController.updateUser(request, response, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});