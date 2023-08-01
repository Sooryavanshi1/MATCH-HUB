const mongoose = require('mongoose')
const createError = require('http-errors')
const Match = require('../Models/match.Model');

module.exports={
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