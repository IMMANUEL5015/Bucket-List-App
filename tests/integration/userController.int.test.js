const request = require('supertest');
const app = require('../../server/routes/index');
const User = require('../../server/models/usermodel');
const newUser = require('../mock-data/integration/new-user-int.json');

let token;
let id;

describe("Performing CRUD operations on Users", () => {
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
    
    //Creating a new user
    it("should sign up a user and assign token", async () => {
        const response  = await request(app)
            .post('/auth/signup')
            .send(newUser);

        expect(response.statusCode).toBe(201); //Create and sign up user
        expect(response.body.token).toBeTruthy();//Assign token to new user
        token = response.body.token;
        id = response.body.data._id;
    });

    //Getting all users
    it("should retrieve all users", async () => {
        const response  = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer ' + token)

        expect(response.statusCode).toBe(200); //Success
        expect(Array.isArray(response.body.message)).toBeTruthy();//Array containing all users
    });

    //Getting a specific user
    it("should retrieve all users", async () => {
        const response  = await request(app)
            .get('/users/' + id)
            .set('Authorization', 'Bearer ' + token)

        expect(response.statusCode).toBe(200); //Success
        expect(response.body.username).toBe("Immanuel5015");//username of the returned user
    });
});