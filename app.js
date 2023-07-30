//we need to use express to create our APIs 
const express = require('express');

//Then we need to initialize our express application
const app = express();

//initializing our database
require('./initialize.Database')();

//now we start our server that listens to events on port 3000 using .listen()
//the first argument is the port number on which the server must listen
//the second argument is the callback function that is called everytime server restarts
//nodemon is used to automatically start the server anytime a change is done in the code
//for installation steps of express and nodemon refer the documentation provided
app.listen(3000,()=>{
    console.log("Server is started on port 3000");
})