//This file will include the Schema of the Database
//we need mongoose as it provides various functions to maniputale MongoDB Collections
const mongoose = require('mongoose');
//we are going to use Schema from mongoose to define the shape of the documents
const Schema = mongoose.Schema;
//Schema Creation
const matchSchema = new Schema({
    //let's define the Properties 
    //first we get the names of the teams involved
    team1_Name:{
        type:String,
        required:true,
    },
    team2_Name:{
        type:String,
        required:true,
    },
    //then we get the compostion of the teams involved
    team1_Composition:{
        type:Array,
        required:true,
    },
    team2_Composition:{
        type:Array,
        required:true,
    },
    //then we get the match date
    match_date:{
        type:String,
        // I will be using DD-MM-YYYY format
        required:true,
    },
    //then we get the venue of the match
    venue:{
        type:String,
        required:true,
    },
    // then we get the player of the match
    palyer_of_the_match:{
        type:String,
        required:true,
    },
    // and lastly we get the winning and losing teams
    winning_team:{
        type:String,
        required:true,
    },
    losing_team:{
        type:String,
        required:true,
    },
    // __v:{ 
    //     type: Number,
    //     select: false
    // }
});

//inorder to use this schema we must create a model
///////////////////////////model name//Schema name
const Match = mongoose.model('match',matchSchema)
//for using this model it must be exported
//we will be using this Model in our Controller module
module.exports = Match
