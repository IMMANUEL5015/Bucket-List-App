const request = require('supertest');
const app = require('../../server/routes/index');
const newBucketlist = require('../mock-data/integration/new-bucketlist-int.json');
const Bucketlist = require('../../server/models/bucketlist.model');

const baseEndpoint = "/bucketlists/"

//id of the first Bucketlist in the database
let id;

//Token for testing purposes
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZmJhYjM4ZWQ0MjE3MWI2ODkzZWM2MCIsImlhdCI6MTU3Njc3NDQ2MCwiZXhwIjoxNTc5MzY2NDYwfQ.7EZN5SEh-33hsUdkQaRPZAWf3f7pdR5rbeGFUNexEfA";
describe("BucketList API Endpoints", () => {
    //Make sure that our test data is not already in the database
    beforeAll( async () => {
        await Bucketlist.findOneAndDelete({
             title: "The Tower"   
        }, () => {
            console.log('Bucketlist deleted!');
        });
    });

    //Making sure that our test data does not remain in the database
    afterAll( async () => {
        await Bucketlist.findOneAndDelete({
             title: "The Tower"   
        }, () => {
            console.log('Bucketlist deleted!');
        });
    });

    //Creating a bucketlist
    it("should be able to create a new bucketlist successfully", async () => {
        const response = await request(app)
            .post(baseEndpoint)
            .set('Authorization', 'Bearer ' + token)
            .send(newBucketlist);

            expect(response.statusCode).toBe(201)//Successfully created
            expect(response.body.title).toStrictEqual("The Tower");
            expect(response.body.description).toStrictEqual("I intend to visit the Leaning Tower of Pisa.");
            expect(response.body.created_by).toStrictEqual("Immanuel Diai");
            expect(response.body.date_created).toBeTruthy();
            expect(response.body.date_modified).toBeTruthy();

            id = response.body._id;
    });

    //Handle errors when creating a bucketlist
    it("should handle errors", async () => {
        const response =  await request(app)
            .post(baseEndpoint)
            .set('Authorization', 'Bearer ' + token)
            .send({"name": "Eat Eba"});

        expect(response.body).toStrictEqual({
            "status": "error",
            "message": "BucketList validation failed: created_by: Please enter your unique username, description: A bucketlist must have a description, title: This is a required field"
        });
    });

    //Tests for GET Requests to get all the Bucketlists
    it("should be able to get all the bucketlists", async () => {
        const response = await request(app)
            .get(baseEndpoint)
            .set('Authorization', 'Bearer ' + token);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].description).toBeDefined();
        expect(response.body[0].date_created).toBeDefined();
        expect(response.body[0].date_modified).toBeDefined();
        expect(response.body[0].created_by).toBeDefined();
    });

    //Tests for authentication errors when trying to GET all the Bucketlists
    it("should return an error if access token is invalid", async () => {
        const response = await request(app)
            .get(baseEndpoint)
            .set('Authorization', 'Bearer ' + 'fnsfksncfksnks');
            expect(response.body).toStrictEqual({
                "status": "Fail",
                "message": "You are unable to interact with this resource. Please login again."
            });
    });



    //Tests for updating a matching Bucketlist
    it("should be able to update a matching bucketlist", async () => {
        const response = await request(app).put(baseEndpoint + id)
            .set('Authorization', 'Bearer ' + token)
            .send({
            "description": "I have the goal of paying a visit to the remarkable Leaning Tower of Pisa.",
        });

        expect(response.body.title).toBe("The Tower");
        expect(response.body.description).toStrictEqual("I have the goal of paying a visit to the remarkable Leaning Tower of Pisa.");
        expect(response.statusCode).toBe(200);
    });

    //Tests for authentication errors when trying to update a Bucketlist
    it("should return an error when a user is using an old token", async () => {
        const response = await request(app).put(baseEndpoint + id)
            .set('Authorization', 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZmJhNjI5NTJkNjliMTI2YzRmNGFjZCIsImlhdCI6MTU3Njc4MDY4NCwiZXhwIjoxNTc5MzcyNjg0fQ.39-8VdVXzTc6mHkxMCRHjGoY-KQo7cVYihD3tIjqek4")
            .send({
            "description": "I have the goal of paying a visit to the remarkable Leaning Tower of Pisa.",
        });

        expect(response.body).toStrictEqual({
            "status": "Fail",
            "message": "Your password was modified recently. Please login again."
        });
    });

    //Test for GETTING a SINGLE Bucketlist
    it("should be able to get a specific Bucketlist, by it's id", async () => {
        const response = await request(app)
            .get(baseEndpoint + id)
            .set('Authorization', 'Bearer ' + token);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toStrictEqual("The Tower");
        expect(response.body.description).toStrictEqual("I have the goal of paying a visit to the remarkable Leaning Tower of Pisa.");
        expect(response.body.created_by).toStrictEqual("Immanuel Diai");
        expect(response.body.date_created).toBeTruthy();
        expect(response.body.date_modified).toBeTruthy();
    });

    //Tests for authentication errors when trying to get a single bucketlist
    it("should return an error if a valid token has no user", async () => {
        const response = await request(app)
            .get(baseEndpoint + id)
            .set('Authorization', 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZmJiZjQ5ZTQzNTI1MGY0YzVmNjVlZiIsImlhdCI6MTU3Njc3OTU5NywiZXhwIjoxNTc5MzcxNTk3fQ.kZI3bFVgWPsZl9l6qRHoJF_HhPU8xUR8vYN6fKrMG7s");

            expect(response.body).toStrictEqual({
                "status": "Fail",
                "message": "This user does not exist."
            });
    });

    //Test for DELETING a SPECIFIC Bucketlist
    it("should be able to delete a single Bucketlist", async () => {
        const response =  await request(app)
            .delete(baseEndpoint + id)
            .set('Authorization', 'Bearer ' + token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({message: "Bucketlist has been successfully deleted"});
    });
});

