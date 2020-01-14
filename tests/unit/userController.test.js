const userController = require('../../server/controllers/userController');
const User = require('../../server/models/usermodel');
const httpMocks = require('node-mocks-http');
const allUsers = require('../mock-data/unit/users/allUsers.json');
const adminUser = require('../mock-data/unit/users/new-admin-user.json');

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