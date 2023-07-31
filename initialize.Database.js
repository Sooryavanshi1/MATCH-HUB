// we will be connecting to our MongoDB Compass and handle Mongoose events
// Installation steps are provided in Documentation
// first we need to require Mongoose
const mongoose = require('mongoose');

//we will initialze our database through app.js
module.exports = () =>{

//now we make a connection to MongoDB Compass
//we use the connection string provided by MongoDB Compass
//we can get the connection string by Opening MongoDB Compass
//as it is present in the new connection URL Section of the home page
// '0.0.0.0' part of the URL can be replaced by 'localhost' depending on the system
// the '27017' part of the  URL may change depending on the system
// the 'MatchesDataBase' part of the URL will be the name of database created in MongoDB Compass
// which can obviously be changed to any name you want
mongoose.connect('mongodb://0.0.0.0:27017/MatchesDataBase')
.then(()=>{
    // we print a message to our terminal if 
    //the connection is Successful
    console.log('mongodb is connected')
})
.catch(err => console.log(err.message));

// handleing mongoose events
mongoose.connection.on('connected',()=>{
    console.log("mongoose is connected to db");
})
mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})
process.on('SIGINT', () => {
      console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
mongoose.connection.on('disconnected',()=>{
    console.log("Mongoose connection is disconnected")
});
}