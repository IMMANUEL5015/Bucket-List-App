const request = require('supertest');
const app = require('../../server/routes/index');
const newUser = require('../mock-data/integration/new-user-int.json');
const User = require('../../server/models/usermodel');
const loginDetails = require('../mock-data/integration/login-user-int.json');

//Base endpoint for authentication
const endpointUrl = "/auth"

//signup path after base endpoint
const signup = "/signup"

//login path after base endpoint
const login = "/login"

//Signing up a user
describe("POST " + endpointUrl + signup, () => {
    //Making sure that our predefined test data is not already in the Database
    beforeAll( async () => {
        await User.findOneAndDelete({
             username: "Immanuel5015",
             email: "immanueldiai@yahoo.com"   
        }, () => {
            console.log('User deleted!');
        });
    });

    //Making sure that our test data does not remain in the database
    afterAll( async () => {
        await User.findOneAndDelete({
             username: "Immanuel5015",
             email: "immanueldiai@yahoo.com"   
        }, () => {
            console.log('User deleted!');
        });
    });

    it("should sign up a user and assign token", async () => {
        const response  = await request(app)
            .post(endpointUrl + signup)
            .send(newUser);

        expect(response.statusCode).toBe(201); //Create and sign up user
        expect(response.body.token).toBeTruthy();//Assign token to new user
    });

    test("error in signing up a new user with existing details", async () => {
        const response = await request(app)
            .post(endpointUrl + signup)
            .send(newUser);

        expect(response.body).toStrictEqual({
            "status": "error",
            "message": "E11000 duplicate key error collection: bucketlist_App.users index: username_1 dup key: { : \"Immanuel5015\" }"
        });;
    });
});

//Logging in a user
describe("POST " + endpointUrl + login, () => {
    test("error occurs when email or password is ommitted", async () => {
        const response = await request(app)
            .post(endpointUrl + login)
            .send({password: "immanuelDiai345"}); //Attempting to log in without an email
            expect(response.body).toStrictEqual({
                "status": "Fail",
                "message": "Please provide your email and password"
            });
    });

    test("error if user not found or password incorrect", async () => {
        const response = await request(app)
            .post(endpointUrl + login)
            .send(loginDetails);

        expect(response.statusCode).toBe(401);
        expect(response.body).toStrictEqual({
            "status": "Fail",
            "message": "Unable to verify. Please provide your correct details."
        });
    });

    it("should login an already existing user", async () => {
        const existingUser = {
            "email": "immanueldiai@gmail.com",
            "password": "immanuelDiai345"
        };

        const response = await request(app)
        .post(endpointUrl + login)
        .send(existingUser);

        expect(response.statusCode).toBe(200); //Success
        expect(response.body).toBeTruthy(); 
    });
});
 


