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
    }
}