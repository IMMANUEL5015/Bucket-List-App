# Bucket-List App

[![Build Status](https://travis-ci.org/IMMANUEL5015/Bucket-List-App.svg?branch=master)](https://travis-ci.org/IMMANUEL5015/Bucket-List-App)
[![Coverage Status](https://coveralls.io/repos/github/IMMANUEL5015/Bucket-List-App/badge.svg?branch=master)](https://coveralls.io/github/IMMANUEL5015/Bucket-List-App?branch=master)

## About the Application
This Full Stack Web App helps its users to keep a list of all the fun and adventurous activities they intend to do within their lifetime.

## Application Features
This Web Application has the features indicated below:

### Authentication
* This app utilizes JSON Web Tokens (JWT) for it's authentication purposes.
* It generates a token upon successul signup / login and returns it to the client.

### Users
* It allows users to be signed up.
* It allows users to login and obtain a token.

### Bucketlists
* It allows new Bucketlists to be created by users.

## Technologies Used in this Project
* Node.js (Allows developers to utilize JavaScript in creating server side applications).
* Express (Node.js framework)
* MongoDB (NOSQL database).
* Mongoose (NPM package for interacting with MONGODB).

## Local Development
The Bucket-List App requires node version 10.16.0 to run successfully.

The following steps must be undertaken in order for the code of this project to work as intended.

```
1. Clone the repo to your local machine using the **git clone repo url** command.
2. Using the terminal, navigate to the cloned directory **cd Bucket-List-App**
3. Install all the project's dependencies and devDependencies using the **npm install -d** command.
4. Create a mongoDB database and insert your URL in file located at **server/mongodb/mongoose.connect.js** 
5. Start the server, using the command **npm start**.
6  You can run tests using **npm test** 
7. Congratulations, your Bucket-List-App is up and running.
```
## Postman Collection

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b4e1f3acd2ad204c8672)

You can use the button above to run the endpoints in postman. Take care to use unique details when signing up, because you cannot sign up with thesame details twice.

## API DOCUMENTATION
This API has endpoints, each of which are dedicated to a single task.
The routes utilizes HTTP response codes to indicate API status and errors.

### Authentication
The Users of this application are assigned a unique token upon a successful signup or login operation. This token is absolutely essential for subsequent HTTP requests to the API for authentication. API requests that are operationalized without authentication will recieve a **fail** response with the status code 401: Unauthorized Access.

### API Endpoints and their Functionality

| Endpoint                 |Function                     |
|--------------------------|-----------------------------|
| POST/auth/signup         | Signs up a user             |
| POST/auth/login          | Logs in an existing user    |
| POST/bucketlists         | Creates a new bucketlists   | 


### Sample Requests and Responses From the API
- [auth](#auth)
  - [Signup user](#signup-user)
  - [Login user](#login-user)
- [Bucketlist](#bucketlist)
  - [Create bucketlist](#create-bucketlist)
  
 ### auth
   - signup
   - login

### Signup user

* Request
     * Endpoint: POST: auth/signup
     * Body (application/json)
     
    ```
     {
    "username": "uniqueUsername",
    "fullName": "Unique User",
    "email": "uniqueuser@gmail.com",
    "photo": "https://www.myprofilepicture.com",
    "password": "longpassword",
    "confirmPassword": "longpassword"
    }
    ```
   
* Response
    * Status: 201: Created
    * Body (application/json)
 
```
  {
    "status": "User has been Successfully Created",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZWY2OTA1M2MzYTg3MWQ0NDQ5MDk5MSIsImlhdCI6MTU3NTk3MTA4NSwiZXhwIjoxNTc4NTYzMDg1fQ.sH2Sxh-26su6diHwI2c0qmskKx9uE3dr3yzhNscAK9w",
    "data": {
        "user": {
            "_id": "5def69053c3a871d44490991",
            "username": "uniqueUsername",
            "fullName": "Unique User",
            "email": "uniqueuser@gmail.com",
            "photo": "https://www.myprofilepicture.com",
            "password": "$2a$12$4C9Z5NfP9kTxTrSN94aTzek9/GmzsdUPt6r0rikiKrxNkwDltoKEy",
            "__v": 0
        }
    }
}
```

### Login user

* Request
     * Endpoint: POST: auth/login
     * Body (application/json)
     
    ```
     {
    "email": "uniqueuser@gmail.com"
    "password": "longpassword",
    }
   ```
   
* Response
    * Status: 201: Ok
    * Body (application/json)
    
 ```
  {
    "status": "Success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZWY2OTA1M2MzYTg3MWQ0NDQ5MDk5MSIsImlhdCI6MTU3NTk3MTczMCwiZXhwIjoxNTc4NTYzNzMwfQ.x8u_VwlX9efqeOoy63HWkjCRmd8es73J1iHoHwK4lS8"
}
```
