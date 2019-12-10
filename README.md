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
* It allows users to be created.
* It allows users to login and obtain a token.

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

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/38018e98135c489e6e8e)

You can use the button above to run the endpoints in postman. Take care to use unique details when signing up, because you cannot sign up with thesame details twice.

