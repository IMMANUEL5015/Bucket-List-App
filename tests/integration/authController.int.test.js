const request = require('supertest');
const app = require('../../server/routes/index');
const newUser = require('../mock-data/new-user.json');
const User = require('../../server/models/usermodel');

//Base endpoint for authentication
const endpointUrl = "/auth"

//signup path after base endpoint
const signup = "/signup"

describe("POST " + endpointUrl + signup, () => {
    //Making sure that our predefined test data is not already in the Database
    beforeAll( async () => {
        await User.findOneAndDelete({
             username: "Immanuel50",
             email: "immanueldiai@gmail.com"   
        }, () => {
            console.log('User deleted!');
        });
    });

    //Making sure that our test data does not remain in the database
    afterAll( async () => {
        await User.findOneAndDelete({
             username: "Immanuel50",
             email: "immanueldiai@gmail.com"   
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
            "message": "E11000 duplicate key error collection: bucketlist_App.users index: username_1 dup key: { : \"Immanuel50\" }"
        });;
    });
});