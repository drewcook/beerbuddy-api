# BeerBuddy API
This repository is an API built with Node.js and Express.js. There are full RESTful endpoints setup, authentication, authorization, error handling, and logging.
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
Since generating a JWT relies on a secret to sign and verify against, export a variable that the app will understand to use for this secret key.  The name of the variable should be `BEERBUDDY_APP_SECRET`.  First run the following:
```bash
export BEERBUDDY_APP_SECRET=12345
```
Then, to start the application, run the following command:
```bash
npm start
```
This will spin up the server on `localhost:3000` attempt to make a connection to your local MongoDB instance.

### Logs
Local log files are created which will store any logs for development.  They are as follows:
- `error.log`: Contains all logs with level `error` and below
- `combined.log`: Contains all logs with level `info` and below
- `exceptions.log`: Contains all unhandled exception logs
- `rejections.log`: Contains all unhandled rejection logs (not working currently)

Additionally, there is plumbing set up to log errors into a MongoDB table of `[appname]_logs`.  Currently it is commented out.

## Using the Production Service
The service is deployed to a Heroku environment, and the data is being stored in a MongoDB Atlas Cloud database.  The current production service can be accessed [here](https://beerbuddy-api.herokuapp.com/).
