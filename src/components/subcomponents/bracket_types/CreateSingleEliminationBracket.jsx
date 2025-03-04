import React, { useEffect, createContext, useState } from 'react';
import matchupStyles from '../single_elim_bracket/BracketMatchup.module.css';

import PropTypes from 'prop-types';

import SingleEliminationBracket from '../single_elim_bracket/SingleEliminationBracket';


// regular function to just get the log base x of a number y
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

let prefabs = {
    '2': [1, 2],
    '4': [1, 4, 2, 3],
    '8': [1, 8, 4, 5, 3, 6, 2, 7],
    '16': [1, 16, 8, 9, 5, 12, 4, 13, 3, 14, 6, 11, 7, 10, 2, 15],
    '32': [1, 32, 16, 17, 9, 24, 8, 25, 5, 28, 12, 21, 13, 20, 4, 29, 3, 30, 14, 19, 11, 22, 6, 27, 7, 26, 10, 23, 15, 18, 2, 31]
}

/***************************
* FOR BRACKET PROPOGRATION *
****************************/
// Get the lowest seed in the specified round (like the round of 64, the round of 32)
function lowestSeededTeamAndMatchup(round) {
    let lowestSeed = 0;
    let matchupNumberAtLoSeed = 0;
    let teamAtHiSeed = 0;

    for (let i in round) {
        // Check if team 1's seed is lower
        if (round[i].team1 > lowestSeed) {
            lowestSeed = round[i].team1;
            matchupNumberAtLoSeed = i;
            teamAtHiSeed = 'team2';
        }
        // Check if team 2's seed is lower
        if (round[i].team2 > lowestSeed) {
            lowestSeed = round[i].team2;
            matchupNumberAtLoSeed = i;
            teamAtHiSeed = 'team1';
        }
    }
    // Return data that includes the lowest seed, the matchup where that low seed occurs, and the team that the low seed occurs
    return {
        lowestSeed: lowestSeed,
        matchupNumberAtLoSeed: matchupNumberAtLoSeed,
        teamAtHiSeed: teamAtHiSeed
    }
}

const CreateSingleEliminationBracket = ({ buildData, updateBracketFunc }) => {


    // easy to access user preference
    const seedingOn = buildData['Seeding'] === 'on' ? true : false;
    const numTeams = buildData['Participants Per Region'];
    const numRegions = buildData['Regions'];
    const numRounds = Math.ceil(getBaseLog(2, numTeams));
    console.log(numRounds + " -numrounds");

    let [bracket, setBracket] = useState({});

    const updateBracket = (region, round, matchup, key, value) => {
        const copyBracket = JSON.parse(JSON.stringify(bracket)); // Deep copy

        if (key === "FIRST_LEVEL") {
            bracket[region][round] = {}
        } else if (key === "NO_KEY") {
            copyBracket[region][round][matchup] = value;
        } else {
            copyBracket[region][round][matchup][key] = value;
        }

        setBracket(copyBracket); // Replace state

    };

    // If only 1 team is present in a matchup, label it correctly
    const setSoloTeam = (bracketObj, region, round, matchup) => {

        if (bracketObj[region][round][matchup].team1 === null && bracketObj[region][round][matchup].team2 !== null) {
            bracketObj[region][round][matchup].soloTeam = true;
        } else if (bracketObj[region][round][matchup].team2 === null && bracketObj[region][round][matchup].team1 !== null) {
            bracketObj[region][round][matchup].soloTeam = true;
        } else if (bracketObj[region][round][matchup].team2 !== null && bracketObj[region][round][matchup].team1 !== null) {
            bracketObj[region][round][matchup].soloTeam = false;
        } else if (bracketObj[region][round][matchup].team2 === null && bracketObj[region][round][matchup].team1 === null) {
            bracketObj[region][round][matchup].soloTeam = false;
        }

        return bracketObj;
    }

    // make sure that teams recieving a by-week are placed correctly between "team1" and "team2"
    // for example, when there are 6 teams, seed 1 would be on the top of the 2nd round, while seed 2 would be at the very bottom
    const checkTeamTopBottom = (bracketObj) => {

        for (let h = 1; h <= numRegions; h++) {
            for (let i = 1; i <= numRounds; i++) {
                let currentRound = bracketObj[h][i];
                for (let j = 1; j <= Object.keys(currentRound).length; j++) {

                    // boolean checks to carry out team switch
                    let isTeamSolo = bracketObj[h][i][j].soloTeam;
                    let isMatchupNumEven = j % 2 === 0;
                    let isTeamInTeam1 = bracketObj[h][i][j].team1 !== null;

                    if (isTeamSolo && isMatchupNumEven && isTeamInTeam1) {
                        bracketObj[h][i][j].team2 = bracketObj[h][i][j].team1
                        bracketObj[h][i][j].team1 = null;
                    }
                }
            }
        }
        return bracketObj;
    }

    // Initialize an empty bracket with settings at null or false.
    useEffect(() => {
        let initialBracket = {};
        for (let h = 1; h <= numRegions; h++) {
            initialBracket[h] = {}
            
            let special_matchups = ['finals']
            if(numRegions === 2) {
                initialBracket['finals'] = {}

            }
            if(numRegions === 4) {
                initialBracket['finals'] = {}
                initialBracket['semi-finals-left'] = {}
                initialBracket['semi-finals-right'] = {}
                special_matchups.push('semi-finals-left')
                special_matchups.push('semi-finals-right')
            }

            for (let label of special_matchups) {
                initialBracket[label] = {
                    team1: null,
                    team2: null,
                    team1Score: null,
                    team2Score: null,
                    team1name: null,
                    team2name: null,
                    teamselected: null,
                    editable: false,
                    showScores: false,
                    showWinner: false,
                    showSelection: false,
                    soloTeam: false,
                    won: false,
                };
            }

            for (let i = 1; i <= numRounds; i++) {
                initialBracket[h][i] = {};

                for (let j = 1; j <= (2 ** i) / 2; j++) {
                    if (i === numRounds) {
                        initialBracket[h][i][j] = {
                            team1: prefabs[2 ** numRounds][(j - 1) * 2],
                            team2: prefabs[2 ** numRounds][(j - 1) * 2 + 1],
                            team1Score: null,
                            team2Score: null,
                            team1name: null,
                            team2name: null,
                            teamselected: null,
                            editable: false,
                            showScores: false,
                            showWinner: false,
                            showSelection: false,
                            soloTeam: false,
                            won: false,
                        };
                    } else {
                        initialBracket[h][i][j] = {
                            team1: null,
                            team2: null,
                            team1Score: null,
                            team2Score: null,
                            team1name: null,
                            team2name: null,
                            teamselected: null,
                            editable: false,
                            showScores: false,
                            showWinner: false,
                            showSelection: false,
                            soloTeam: false,
                            won: false,
                        };
                    }
                }

            }

        }
        console.log(bracket);

        for (let i = 1; i <= numRegions; i++) {

            // Propogate through bracket started in the finals round to correctly create bye-weeks and seeding

            let lowestSeedInfo = lowestSeededTeamAndMatchup(initialBracket[i][numRounds]);

            while (lowestSeedInfo.lowestSeed > numTeams) {

                let matchupNumberAtLoSeed = lowestSeedInfo.matchupNumberAtLoSeed;
                let teamAtHiSeed = lowestSeedInfo.teamAtHiSeed;

                let nextUpSpot = Math.ceil(matchupNumberAtLoSeed / 2);

                if (initialBracket[i][numRounds - 1][nextUpSpot].team1 == null) {
                    initialBracket[i][numRounds - 1][nextUpSpot].team1 = initialBracket[i][numRounds][matchupNumberAtLoSeed][teamAtHiSeed];

                } else {
                    initialBracket[i][numRounds - 1][nextUpSpot].team2 = initialBracket[i][numRounds][matchupNumberAtLoSeed][teamAtHiSeed]

                }

                initialBracket[i][numRounds][matchupNumberAtLoSeed].team1 = null
                initialBracket[i][numRounds][matchupNumberAtLoSeed].team2 = null

                initialBracket = setSoloTeam(initialBracket, i, numRounds - 1, Math.ceil(matchupNumberAtLoSeed / 2));
                initialBracket = checkTeamTopBottom(initialBracket);
                lowestSeedInfo = lowestSeededTeamAndMatchup(initialBracket[i][numRounds]);

            }
        }

        console.log(initialBracket);
        setBracket(initialBracket); // Set the initialized bracket



    }, [numRounds, numTeams])



    if (Object.keys(bracket).length == 0) {
        return;
    }


    const handleInputChange = (region, event, team, round, matchup) => {

        updateBracket(region, round, matchup, `team${team}name`, event.target.value);
        updateBracketFunc(bracket);

    };


    return (
        <SingleEliminationBracket buildData={buildData} bracket={bracket}>
            <input className={matchupStyles.team_input} type='text' placeholder='Team 1' onChange={handleInputChange} ></input>
            <input className={matchupStyles.team_input} type='text' placeholder='Team 2' onChange={handleInputChange} ></input>
        </SingleEliminationBracket>
    )
}

export default CreateSingleEliminationBracket