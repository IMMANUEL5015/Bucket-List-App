const request = require('supertest');
const app = require('../../server/routes/index');
const newBucketlist = require('../mock-data/integration/new-bucketlist-int.json');
const Bucketlist = require('../../server/models/bucketlist.model');

const baseEndpoint = "/bucketlists/"

//id of the first Bucketlist in the database
let BucketlistId;

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
    it("should create a new bucketlist successfully", async () => {
        const response = await request(app)
            .post(baseEndpoint)
            .send(newBucketlist);

            expect(response.statusCode).toBe(201)//Successfully created
            expect(response.body.title).toStrictEqual("The Tower");
            expect(response.body.description).toStrictEqual("I intend to visit the Leaning Tower of Pisa.");
            expect(response.body.created_by).toStrictEqual("Immanuel Diai");
            expect(response.body.date_created).toBeTruthy();
            expect(response.body.date_modified).toBeTruthy();

            BucketlistId = response.body._id;
    });

    //Handle errors when creating a bucketlist
    it("should handle errors", async () => {
        const response =  await request(app)
            .post(baseEndpoint)
            .send({"name": "Eat Eba"});

        expect(response.body).toStrictEqual({
            "status": "error",
            "message": "BucketList validation failed: created_by: Please enter your unique username, description: A bucketlist must have a description, title: This is a required field"
        });
    });

    //Tests for GET Requests to get all the Bucketlists
    it("should get all the bucketlists", async () => {
        const response = await request(app).get(baseEndpoint);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].description).toBeDefined();
        expect(response.body[0].date_created).toBeDefined();
        expect(response.body[0].date_modified).toBeDefined();
        expect(response.body[0].created_by).toBeDefined();
    });

    //Tests for updating a matching Bucketlist
    it("should update a matching bucketlist", async () => {
        const response = await request(app).put(baseEndpoint + BucketlistId).send({
            "description": "I have the goal of paying a visit to the remarkable Leaning Tower of Pisa.",
        });

        expect(response.body.title).toBe("The Tower");
        expect(response.body.description).toStrictEqual("I have the goal of paying a visit to the remarkable Leaning Tower of Pisa.");
        expect(response.statusCode).toBe(200);
    });

    //Test for GETTING a SINGLE Bucketlist
    it("should get a specific Bucketlist, by it's id", async () => {
        const response = await request(app)
            .get(baseEndpoint + BucketlistId);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toStrictEqual("The Tower");
        expect(response.body.description).toStrictEqual("I have the goal of paying a visit to the remarkable Leaning Tower of Pisa.");
        expect(response.body.created_by).toStrictEqual("Immanuel Diai");
        expect(response.body.date_created).toBeTruthy();
        expect(response.body.date_modified).toBeTruthy();
    });
});

