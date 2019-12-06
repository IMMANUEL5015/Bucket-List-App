const authController = require('../../server/controllers/authController');
const User = require('../../server/models/usermodel');
const httpMocks = require('node-mocks-http');
const fakeUser = require('../mock-data/new-user.json');

jest.mock('../../server/models/usermodel');

let request, response, next;

beforeEach(() => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = jest.fn();
});

//Signing up user
describe("AuthController API", () => {
    beforeEach(() => {
        request.body = fakeUser;
    });

    test('function for signing up a user must be in existence', () => {
        expect(typeof authController.signup).toBe('function');
    });

    test('the user\'s details has to be  in the body of the request', () => {
        authController.signup(request, response, next);
        expect(User.create).toBeCalledWith(fakeUser);
    });

    test('must respond with a status code of 201 as well as the user details', async () => {
        User.create.mockReturnValue(fakeUser);
        await authController.signup(request, response, next);
        expect(response.statusCode).toBe(201);
        expect(response._isEndCalled()).toBeTruthy();
    });

    test('expect password to be equal to confirmPassword ', async () => {
        const newUser = await User.create(fakeUser);
        expect(newUser.confirmPassword).toEqual(newUser.password);
    });

    test('should return a success message and a token in response', async () => {
        User.create.mockReturnValue(fakeUser);
        await authController.signup(request, response, next);
        expect(response._getJSONData().status).toBe('User has been Successfully Created');
        expect(response._getJSONData().token).toBeTruthy();
    });

    it("should handle errors", async () => {
        const errorMessage = {message: "Unable to signup user"};
        const rejectedPromise = Promise.reject(errorMessage);

        User.create.mockReturnValue(rejectedPromise);
        await authController.signup(request, response, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});