//we need to use express to create our APIs 
const express = require('express');

//we need to use http-errors package for error handeling
const createError = require('http-errors');

//Then we need to initialize our express application
const app = express();

//we need to handle the data from MatchRoute
const MatchRoute = require('./Routes/match.Routes')


//inorder to parse our req.body(json payload)
//we need a middleware
app.use(express.json());

// the above function can only parse json type of body
// in order to use Query string type body we need another middle ware
app.use(express.urlencoded({ extended : true}))

//initializing our database
require('./initialize.Database')();

//we will be using the MatchRoute for different http requests
//'matches'(Route) here will be the name of the Collection in 'MatchesDataBase' database
app.use('/matches', MatchRoute);

//handling routes that are not defined
//middleware
//404 handler
app.use((req,res,next)=>{

    next(createError(404,'Not Found'));
});

//error handler
app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status : err.status || 500,
            message : err.message 
        }
    });
});

//now we start our server that listens to events on port 3000 using .listen()
//the first argument is the port number on which the server must listen
//the second argument is the callback function that is called everytime server restarts
//nodemon is used to automatically start the server anytime a change is done in the code
//for installation steps of express and nodemon refer the documentation provided
app.listen(3000,()=>{
    console.log("Server is started on port 3000");
})