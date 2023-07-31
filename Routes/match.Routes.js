//Routes are used to handle different types of HTTP requests 
//(e.g., GET, POST, PUT, DELETE) and to direct the flow of
// incoming requests to the appropriate controller functions
// that process the request and send back the response

const express = require('express')

// we invoke the router function that is inside the express package
const router = express.Router();

//we need to call the Controller functions to handle request and response
const MatchController = require('../Controllers/match.Controller');

//now we create the route for creating the match
//we use the .post() http method to create a new match
//the first parameter and represents the URL path for which the route should be triggered
//This is the second parameter is function that will be executed when a POST request is made to the specified route
router.post('/',MatchController.createMatch);

//now we create the route for getting all matches by date
//we use the .get() http method to find a the matches
//we will be using query strings to implement it
router.get('/',MatchController.getMatchesByDate);

//we need to export this router to use it in other files(app.js)
module.exports = router;