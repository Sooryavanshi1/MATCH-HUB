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
    updateMatchResults:async(req,res,next)=>{
        try {
            const id = req.params.id;
            const updates = req.body;
            const winning_team = req.body.winning_team;
            const losing_team = req.body.losing_team;
            const options = {new : true};
            const match = await Match.findById(id);

            if(winning_team===""){
                throw(createError(422,"Please Provide the winning team"))
            }
            if(losing_team===""){
                throw(createError(422,"Please Provide the losing team"))
            }
            if(winning_team!==match.team1_Name && winning_team!==match.team2_Name){
                throw(createError(404,"Provided winning team has not played the match"))
            }
            if(losing_team!==match.team1_Name && losing_team!==match.team2_Name){
                throw(createError(404,"Provided losing team has not played the match"))
            }
            const UpdatedResults = await Match.findByIdAndUpdate(id,updates,options);
            if(!UpdatedResults){
                throw(createError(404,"Match Cannot be found"))
            }
            res.send(UpdatedResults);
        } catch (error) {
            next(error);
        }
    },
    updatePlayerOfMatch: async(req,res,next)=>{
        const id = req.params.id;
        const updates = req.body;
        const player_of_the_match = req.body.palyer_of_the_match;
        const options = {new:true};
        const match = await Match.findById(id);
        try {
            if(!match){
                throw(createError(404,"match not found"));
            }
            if(match.winning_team==="Not declared yet"){
                throw(createError(422,"Update the match results first"))
            }
            const winning_team = match.winning_team;
            if(match.team1_Name===winning_team  && !match.team1_Composition.includes(player_of_the_match)){
                throw(createError(404,"Player mentioned is not a player of the winning team"))
            }
            if(match.team2_Name===winning_team  && !match.team2_Composition.includes(player_of_the_match)){
                throw(createError(404,"Player mentioned is not a player of the winning team"))
            }
            if((match.team1_Composition.includes(player_of_the_match) && match.team1_Name===winning_team)||(match.team2_Composition.includes(player_of_the_match) && match.team2_Name===winning_team)){
                const UpdatedResults = await Match.findByIdAndUpdate(id,updates,options);
                if(!UpdatedResults){
                    throw(createError(404,"Match Cannot be found"))
                }
                res.send(UpdatedResults);
            }
        } catch (error) {
            next(error)
        }
    },
    getATeamsPerformance: async(req,res,next)=>{
        try {
            const teamName = req.params.teamName;
        
            // Find matches where the provided team was either the winning team or the losing team
            const matches = await Match.find({
              $or: [{ winning_team: teamName }, { losing_team: teamName }]
            });
        
            // Calculate the number of wins and losses for the team
            let wins = 0;
            let losses = 0;
        
            matches.forEach(match => {
              if (match.winning_team === teamName) {
                wins++;
              } else if (match.losing_team === teamName) {
                losses++;
              }
              
            });
            if(wins===0 && losses===0){
                throw(createError(404,"The team provided has not played a single match" ))
            }
            // Return the team's performance (number of wins & losses) in the response
            res.send({ team: teamName, wins, losses });
          } catch (error) {
            next(error);
          }
    }
}