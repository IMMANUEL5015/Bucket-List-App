const authController = require('../../server/controllers/authController');
const User = require('../../server/models/usermodel');
const httpMocks = require('node-mocks-http');
const fakeUser = require('../mock-data/unit/new-user-unit.json');
const loginUser = require('../mock-data/unit/login-user-unit.json');


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

//Logging in user
describe("authController.login", () => {
    it("should be a function", () => {
        expect(typeof authController.login).toBe("function");
    });

    it("user login credentials should be in the body of the request", async () => {
        request.body.email = loginUser.email;
        request.body.password = loginUser.password;

        await authController.login(request, response, next);

        expect(request.body.email).toStrictEqual("immanueldiai@gmail.com");
        expect(request.body.password).toStrictEqual("immanuelDiai345");
    });

    it("should return an error if email is ommitted", async () => {
        request.body.email;
        request.body.password = loginUser.password;

        await authController.login(request, response, next);

        expect(response.statusCode).toBe(400);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            "status": "Fail",
            "message": "Please provide your email and password"
        });
    });

    it("should return an error if password is ommitted", async () => {
        request.body.email = loginUser.email;
        request.body.password;

        await authController.login(request, response, next);

        expect(response.statusCode).toBe(400);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            "status": "Fail",
            "message": "Please provide your email and password"
        });
    });

    
    it("error if user not found", async () => {
        request.body.email = "incorrectemail@yahoo.com";
        request.body.password = loginUser.email;

        User.findOne.mockReturnValue(null);

        await authController.login(request, response, next);

        expect(response.statusCode).toBe(401); //statusCode 401 means Unauthorized
    });

    it("status code 401 if password is incorrect", async () => {
        request.body.email = loginUser.email;
        request.body.password = "incorrectPassword";

        await authController.login(request, response, next);

        expect(response.statusCode).toBe(401); //Unauthorized
    });
   
    it("should handle errors", async () => {
        request.body.email = loginUser.email;
        request.body.password = loginUser.password;
        
        const errorMessage = {message: "Unable to perform login operation"};
        const rejectedPromise = Promise.reject(errorMessage);

        User.findOne.mockReturnValue(rejectedPromise);

        await authController.login(request, response, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

//Tests for the controller that protects routes from non-logged in users
describe('authController.protect', () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZmI5NmNhMWI1ZDZjMWJhNGMxNmIxNiIsImlhdCI6MTU3Njc2OTIzMCwiZXhwIjoxNTc5MzYxMjMwfQ.OIDEU1Xy2UiOnFUms9Ig8iidMesRqL9NzhHtLuWc62M";
    
    it("should be a function", () => {
        expect(typeof authController.protect).toBe("function");
    });

    it("should prompt the user to login, if no token is found", async () => {
        request.headers = {authorization: "there is no token"};
        await authController.protect(request, response, next);
        expect(response.statusCode).toBe(401);
        expect(response._isEndCalled()).toBeTruthy();
        expect(response._getJSONData()).toStrictEqual({
            status: "Fail",
            message: "We are unable to verify your identity. Please login to gain access"
        });
    });
});