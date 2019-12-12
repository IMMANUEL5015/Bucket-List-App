const request = require('supertest');
const app = require('../../server/routes/index');
const newBucketlist = require('../mock-data/integration/new-bucketlist-int.json');
const Bucketlist = require('../../server/models/bucketlist.model');

const baseEndpoint = "/bucketlists"

//Creating a bucketlist
describe("POST " + baseEndpoint, () => {
    //Make sure that our test data is not already in the database
    beforeAll( async () => {
        await Bucketlist.findOneAndDelete({
             name: "The Tower"   
        }, () => {
            console.log('Bucketlist deleted!');
        });
    });

    //Making sure that our test data does not remain in the database
    afterAll( async () => {
        await Bucketlist.findOneAndDelete({
             name: "The Tower"   
        }, () => {
            console.log('Bucketlist deleted!');
        });
    });

    it("should create a new bucketlist successfully", async () => {
        const response = await request(app)
            .post(baseEndpoint)
            .send(newBucketlist);

            expect(response.statusCode).toBe(201)//Successfully created
            expect(response.body.name).toStrictEqual("The Tower");
            expect(response.body.description).toStrictEqual("I intend to visit the Leaning Tower of Pisa.");
            expect(response.body.created_by).toStrictEqual("Immanuel Diai");
            expect(response.body.date_created).toBeTruthy();
            expect(response.body.date_modified).toBeTruthy();
    });

    it("should handle errors", async () => {
        const response =  await request(app)
            .post(baseEndpoint)
            .send({"title": "Eat Eba"});

        expect(response.body).toStrictEqual({
            "status": "error",
            "message": "BucketList validation failed: created_by: Please enter your unique username, description: A bucketlist must have a description, name: This is a required field"
        });
    });
});

