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
* It verifies the token to make sure that users are authenticated before they can interact with some delicate resources.

### Users
* It allows users to be signed up.
* It allows users to login and obtain a token.
* It allows users to reset their passwords if they forget it.
* It allows a logged in administrator to retrieve all Users data.
* It allows a logged in administrator to retrieve the data of any specific user.
* It allows a logged in regular user to retrieve their own data.
* It allows a logged in administrator to update the data of any specific user.
* It allows a logged in regular user to update their own data.
* It allows a logged in administrator to delete the account of any specific user.
* It allows a logged in regular user to delete their own account.
* It allows logged in users to update their passwords

### Roles
* It ensures that users have roles.
* It ensures user roles could be admin or regular.


### Bucketlists
* It allows new Bucketlists to be created by both admin and regular authenticated users. 
* It associates individual Bucketlists with their respective creators.
* It allows authenticated regular users to retrieve only their own Bucketlists.
* It allows authenticated admin users to retrieve all Bucketlists.
* It gives authenticated admin users the ability to retrieve, update and delete any specific Bucketlist.
* It gives authenticated regular users the ability to retrieve, update and delete any of their own associated specific Bucketlist.


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
The Users of this application are assigned a unique token upon a successful signup or login operation. This token is absolutely essential for subsequent HTTP requests to the API for authentication. API requests that are operationalized without authentication will recieve a **fail** response with the status code 401: Unauthorized Access. The token can be attached to the request's header as the value of the **authorization** key.

### Password Reset
When you forget your password, the following steps must be followed in order to regain control of your account:
* Make a post request with your email address (the one you used when signing up) to the **forgotpassword** route.
* A link will be sent to the email address. 
* With that link, make a patch request to the **resetpassword** route, along with your new password.
* The new password must be confirmed.
* You should be logged in automatically. (**Scroll down a little bit to see a demo**).

### Password Update
When your password is compromised, you can still change it even when you have not forgotten it.

All you need to do is follow these steps:
* Make a patch request to the **updateuserpassword** route with the following details
    - The Current Password
    - The New Password
    - Confirm the New Password
* Congratulations! You should be logged in automatically. (**Scroll down a little bit to see a demo**).

### API Endpoints and their Functionality

| Endpoint                          |Function                               |
|-----------------------------------|---------------------------------------|
| POST/auth/signup                  | Signs up a user                       |
| POST/auth/login                   | Logs in an existing user              |
| POST/auth/forgotpassword          | Sends a reset link to the user's email| 
| PATCH/auth/resetpassword/:token   | Resets the user's password            |
| GET/users                         | Retrieve all Users                    |
| GET/users/:id                     | Retrieve a specific user              |
| PUT/users/:id                     | Update a specific user                |
| PATCH/users/:id/updateuserpassword|Update the password of a specific user |
| DELETE/users/:id                  | Delete a  user's account              |
| POST/bucketlists                  | Creates a new bucketlist              |
| GET/bucketlists                   | Retrieves all bucketlists             |
| GET/bucketlists/:id               | Retrieves a single bucketlist         |
| PUT/bucketlists/:id               | Edit and Update a bucketlist          |
| DELETE/bucketlists/:id            | Delete a bucketlist                   |
 

### Sample Requests and Responses From the API
- [Auth](#auth)
  - [Signup user](#signup-user)
  - [Login user](#login-user)

- [Reset password](#reset-password)
  - [Forgot password](#forgot-password)
  - [Reset password](#reset-password)

- [Users](#users)
  - [Get users](#get-users)
  - [Get user](#get-user)
  - [Update user](#update-user)
  - [Update password](#update-password)
  - [Delete user](#delete-user)

- [Bucketlist](#bucketlist)
  - [Create bucketlist](#create-bucketlist)
  - [Get bucketlists](#get-bucketlists)
  - [Get bucketlist](#get-bucketlist)
  - [Update bucketlist](#update-bucketlist)
  - [Delete bucketlist](#delete-bucketlist)

  
 ### Auth
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
            "bucketlists": [],
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

### Reset password
   - Forgot password
   - Reset password

### Forgot password

* Request
     * Endpoint: POST: auth/forgotpassword/
     * Body (application/json)
     
    ```
     {
    "email": "uniqueuser@gmail.com",
    }
    ```
   
* Response
    * Status: 200: Success
    * Body (application/json)
 
```
    {
        "status": "Success",
        "message": "Your reset link has been sent to your email address.",
        "yourResetToken": "836dea2ef0823c1563010eaa7184eca32e2d33a8f8d55cf66f0703ec27f43ec3"
    }
```

### Reset password

* Request
     * Endpoint: PATCH: auth/resetpassword/836dea2ef0823c1563010eaa7184eca32e2d33a8f8d55cf66f0703ec27f43ec3
     * Body (application/json)
     
    ```
     {
    "password": "longpassword",
    "confirmpassword": "longpassword",
    }
   ```
   
* Response
    * Status: 200: Ok
    * Body (application/json)
    
 ```
    {
        "status": "Successful!",
        "message": "Your Password Has Been Changed Successfully!",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMTQzYzBhYmVhZjBkMDNkNDRiNjA0ZCIsImlhdCI6MTU3ODc1NjUyMywiZXhwIjoxNTgxMzQ4NTIzfQ.S4VkkwOmERVvthh6nKC1a45FqobcJsehMlQokuqEy5w"
    }
```

### Users
### Get users

* Request
     * Endpoint: GET: /users

    
 * Response
      * Status: 200: Ok
      * Body (application/json)
 
```
  {
    "status": "Success",
    "message": [
        {
            "bucketlists": [
                "5e01725e2f08bf16c44f0a3c",
                "5e14a39b931a600910072cb2"
            ],
            "passwordChangedAt": "2019-12-18T00:00:00.000Z",
            "role": "regular",
            "_id": "5e016bc1b437260f3c4e5379",
            "username": "Benjamin25",
            "fullName": "Benjamin Diai",
            "email": "benjamindiai@gmail.com",
            "password": "$2a$12$nYmOD5hebKrDYJovF1vKZuqQtNcmwfPqM.KgA1R1jmBElKSp8zpOW",
            "__v": 128
        },
        {
            "bucketlists": [],
            "passwordChangedAt": "2019-12-26T00:00:00.000Z",
            "role": "regular",
            "_id": "5e0229837209a01ce0a5a8cd",
            "username": "Immanuel50",
            "fullName": "Immanuel Diai",
            "email": "immanueldiai@gmail.com",
            "password": "$2a$12$4JXHx4beO586AXIWrPbqcuBGZjVpzo2s9qNKYyw0LbjNlFwsFJrEu",
            "__v": 0
        },
    ]
}
```
### Get user

* Request
     * Endpoint: GET: /users/5e016bc1b437260f3c4e7066

    
 * Response
      * Status: 200: Ok
      * Body (application/json)
 
```
        {
        "bucketlists": [
            "5e01725e2f08bf16c44f0a3c",
            "5e14a39b931a600910072cb2"
        ],
        "passwordChangedAt": "2019-12-18T00:00:00.000Z",
        "role": "regular",
        "_id": "5e016bc1b437260f3c4e7066",
        "username": "Benjamin25",
        "fullName": "Benjamin Diai",
        "email": "benjamindiai@gmail.com",
        "password": "$2a$12$nYmOD5hebKrDYJovF1vKZuqQtNcmwfPqM.KgA1R1jmBElKSp8zpOW",
        "__v": 128
    }
```

### Update user

* Request
     * Endpoint: PUT: /users/5e016bc1b437260f3c4e7066

    ```
    {
        "fullName":"Diai Benjamin"
    }
    ```
    
 * Response
      * Status: 200: Ok
      * Body (application/json)
 
```
        {
        "bucketlists": [
            "5e01725e2f08bf16c44f0a3c",
            "5e14a39b931a600910072cb2"
        ],
        "passwordChangedAt": "2019-12-18T00:00:00.000Z",
        "role": "regular",
        "_id": "5e016bc1b437260f3c4e7066",
        "username": "Benjamin25",
        "fullName": "Diai Benjamin",
        "email": "benjamindiai@gmail.com",
        "password": "$2a$12$nYmOD5hebKrDYJovF1vKZuqQtNcmwfPqM.KgA1R1jmBElKSp8zpOW",
        "__v": 128
    }
```
### Update password

* Request
     * Endpoint: PATCH: users/5e016bc1b437260f3c4e7066/updateuserpassword
     * Body (application/json)
     
    ```
     {
    "currentPassword": "yourcurrentpassword",
    "newPassword": "yournewpassword",
    "confirmNewPassword": "yournewpassword
    }
   ```
   
* Response
    * Status: 200: Ok
    * Body (application/json)
    
 ```
    {
        "status": "Success",
        "message": "You are now logged into the application.",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMDIyNTgzNzIwOWExMWNlMGE1YTlhYiIsImlhdCI6MTU3OTE3MTE3NiwiZXhwIjoxNTgxNzYzMTc2fQ.eJWlnK28NclaT9-mCDoGIXHbmimJ2gSs8NZjejWAwfk"
    }
```
### Delete user

* Request
     * Endpoint: DELETE: /users/5e016bc1b437260f3c4e7066
    
 * Response
      * Status: 200: Ok
      * Body (application/json)
 
```
    {
        "status": "Success",
        "message": "This account has been successfully deleted."
    }
```

### Bucketlist

### Create bucketlist

* Request
     * Endpoint: POST: /users/:userid/bucketlists
     * Body (application/json)
     
    ```
    {
    "title":"The Tower",
    "description": "I intend to visit the leaning tower of pisa in Italy before I die."
    }
    ```
    
 * Response
      * Status: 201: Created
      * Body (application/json)
 
```
  {
    "_id": "5e03e71bcf6db21efc6fa625",
    "title": "The Tower",
    "description": "I intend to visit the Leaning Tower of Pisa.",
    "created_by": "Benjamin Diai",
    "date_created": "2019-12-28T05:24:43.518Z",
    "date_modified": "2019-12-28T05:24:43.518Z",
    "__v": 0
}
```

### Get bucketlists

* Request
     * Endpoint: GET: /users/:userid/bucketlists

    
 * Response
      * Status: 200: Ok
      * Body (application/json)
 
```
  [
    {
        "_id": "5df1dd00a492e71344f691a6",
        "title": "Climb a Mountain",
        "description": "It has always been my dream to climb the great Mountain Everest.",
        "created_by": "Immanuel Diai",
        "date_created": "2019-12-12T06:24:00.951Z",
        "date_modified": "2019-12-12T06:24:00.953Z",
        "__v": 0
    },
    {
        "_id": "5df2192b2d68400ed80ec1e6",
        "title": "Visit Israel",
        "description": "I intend to visit the Holy Land  before I die.",
        "created_by": "Immanuel Diai",
        "date_created": "2019-12-12T10:40:43.619Z",
        "date_modified": "2019-12-12T10:40:43.619Z",
        "__v": 0
    }
]
```

### Get bucketlist

* Request
     * Endpoint: GET: /users/:userid//bucketlists/:id

    
 * Response
      * Status: 200: Ok
      * Body (application/json)
 
```
    {
        "_id": "5df21b5154069f17003bdd06",
        "title": "The Colosseum",
        "description": "I must pay a visit to the Colosseum in Rome to see where the great gladiators performed",
        "created_by": "Voltage Diai",
        "date_created": "2019-12-12T10:49:53.535Z",
        "date_modified": "2019-12-12T10:49:53.535Z",
        "__v": 0
    }
```

### Update bucketlist

* Request
    * Endpoint: PUT `/users/:userid//bucketlists/:id`
    * Body: `application/json`
    

    ```
      {
        "description": "I have a strong desire to visit the Holy Land  before I die."
    }
    ```
* Response
    * Status: `200: Ok`
    * Body: `application/json`
    

    ```
        {
            "_id": "5df2192b2d68400ed80ec1e6",
            "title": "Visit Israel",
            "description": "I have a strong desire to visit the Holy Land  before I die.",
            "created_by": "Immanuel Diai",
            "date_created": "2019-12-12T10:40:43.619Z",
            "date_modified": "2019-12-12T10:40:43.619Z",
            "__v": 0
        }
    ```

    ### Delete bucketlist

* Request
    * Endpoint: DELETE `/users/:userid/bucketlists/:id`
    
* Response
    * Status: `200: Ok`
    
    * Body: `application/json`
    

    ```
        {
            "message": "Bucketlist has been successfully deleted"
        }

    ```    
