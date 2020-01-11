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

//Endpoint for forgotten passwords
const forgotPassword = "/auth/forgotPassword";

//Test Reset Token
let resetToken;

//Endpoint for resetting passwords
const resetPassword = "/auth/resetPassword/";

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
 
//When a user forgets their password
describe("POST " + forgotPassword, () => {
    it("should respond with a success message and a reset link", async () => {
        const response = await request(app)
            .post(forgotPassword)
            .send({email: "raphaeldiai@gmail.com"});

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("Success");
            expect(response.body.message).toBe("Your reset link has been sent to your email address.");
            
            resetToken = response.body.yourResetToken;
    });
});

//When a user resets their password
describe("POST " + resetPassword, () => {
    it("should return an error if the reset token has expired", async () => {
        const response = await request(app).patch("/auth/resetPassword/" + process.env.RESET_TOKEN);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("Fail");
        expect(response.body.message).toBe("Your reset token has expired. Please request for a new reset token.");         
    });
    
    it("should respond with a success message if everything goes well.", async () => {
        const response = await request(app)
            .patch(resetPassword + resetToken)
            .send({
                password: process.env.ADMIN_PASSWORD,
                confirmPassword:process.env.ADMIN_PASSWORD
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("Successful!");
            expect(response.body.message).toBe("Your Password Has Been Changed Successfully!");
            expect(response.body.token).toBeTruthy();
    });
});
