# Vidly Service
This repository is an API built with Node.js and Express.js. It attempts to setup a mock scenario of handling movies at a movie rental store.  There are full RESTful endpoints setup, authentication, authorization, error handling, and logging.
## Prerequisites
To run this service, you must have a local instance of both Node and MongoDB installed on your machine.

- [Install Node](https://nodejs.org)
- [Install MongoDB](https://docs.mongodb.com/manual/administration/install-community/)

## Installing packages
You can use NPM to install the package dependencies for the application.  Run the following command:
```bash
npm install
```
## Running the Service Locally
Since generating a JWT relies on a secret to sign and verify against, export a variable that the app will understand to use for this secret key.  The name of the variable should be `VIDLY_APP_SECRET`.  First run the following:
```bash
export VIDLY_APP_SECRET=12345
```
Then, to start the application, run the following command:
```bash
npm start
```
This will spin up the server on `localhost:3000` attempt to make a connection to your local MongoDB instance.

## Using the Production Service
The service is deployed to a Heroku environment, and the data is being stored in a MongoDB Atlas Cloud database.  The current production application can be viewed [here](https://vidly-service.herokuapp.com/).