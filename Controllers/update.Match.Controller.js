const mongoose = require('mongoose')
const createError = require('http-errors')
const Match = require('../Models/match.Model')

module.exports ={
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
    }
}