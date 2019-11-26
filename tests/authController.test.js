const authController = require('../server/controllers/authController');
const User = require('../server/models/usermodel');
const httpMocks = require('node-mocks-http');
const fakeUser = require('./mock-data/new-user.json');
const validator = require('validator');

User.create = jest.fn();

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

describe("authController should a a new user to the database", () => {
    beforeEach(() => {
        req.body = fakeUser;
    });

    test('function for signing up a user must be in existence', () => {
        expect(typeof authController.signup).toBe('function');
    });

    test('the user\'s details has to be  in the body of the request', () => {
        authController.signup(req, res, next);
        expect(User.create).toBeCalledWith(fakeUser);
    });

    test('must respond with a status code of 201 as well as the user details', async () => {
        User.create.mockReturnValue(fakeUser);
        await authController.signup(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    test('expect password to be equal to confirmPassword ', async () => {
        const newUser = await User.create(fakeUser);
        expect(newUser.confirmPassword).toEqual(newUser.password);
    });

    test('should return a success message and a token in response', async () => {
        User.create.mockReturnValue(fakeUser);
        await authController.signup(req, res, next);
        expect(res._getJSONData().status).toBe('Success');
        expect(res._getJSONData().token).toBeTruthy();
    });
});
