// business logic for various API endpoints related to matches
// are implemented in Controller module
const mongoose = require('mongoose');

// we are using http-errors that is a npm package for efficient error handeling
// installation steps provided in documentation
const createError = require('http-errors');

// The Controllers acts as the intermediary between Routes and Models
// for its interaction with the Models we must import our Models in this file
const Match = require('../Models/match.Model');

// we will be using these logics in our Routes Module so we must export it
module.exports={

    //Controller for creating a new match
    //we use async to use await in the function
    createMatch : async(req,res,next)=>{
        try {

            // we are creating a new match by parsing req.body
            // which has a json payload
            const match = new Match(req.body);

            //Using await pauses the execution of its surrounding async function
            //until the promise is settled (that is, fulfilled or rejected)
            //we are trying to save the match in our collection using .save()
            const result = await match.save();

            //we are going to send this result in our response
            res.send(result);

            //for error handeling
        } catch (error) {
            console.log(error.message);
            if(error.name === 'ValidationError'){
                next(createError(422, error.message))
                return
            }
            next(error);
        }
    },
    getMatchesByDate: async(req,res,next)=>{
       try {
        const date = req.query.match_date;

        // Find matches with the specified date
        const matches = await Match.find({ match_date:date});
        // if there are no matches on the date or the date format is wrong
        if(matches.length===0){
            throw createError(404,"No matches on this date")
        }

        // Return the matches in the response
        res.send(matches);
       } catch (error) {
        next(error);
       }
    },
    getMatchByID:async(req,res,next)=>{
        //first we get the id 
        const id = req.params.id;
        try {
            const match = await Match.findById(id,{__v:0});
            //if there is no match corresponding to the id
            if(!match){
                throw createError(404,"No Match by this ID")
            }
            res.send(match);
        } catch (error) {
            //if the id is of invalid type
            if(error instanceof mongoose.CastError){
                next(createError(400,"Invalid Match ID"));
                return;
            }
            next(error)
            console.log(error.message)
        }
    },
    getAllMatches: async(req,res,next)=>{
        try {
            const matches = await Match.find({},{__v:0});
            res.send(matches)
        } catch (error) {
            console.log(error.message)
        }
    },
    deleteAMatchByID :async(req,res,next)=>{

        const id = req.params.id;
        try {
            const result = await Match.findByIdAndDelete(id);
            if(!result){
                throw createError(404,"Match not found")
            }
            res.send(result)
    //if we try to delete a non existent file then the 
    //result will have null value
        } catch (error) {
            console.log(error.message)
            if(error instanceof mongoose.CastError){
                next(createError(400,"Invalid Match Id"));
                return;
            }
            next(error)
        }
    }
}