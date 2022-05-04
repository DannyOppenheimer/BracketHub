import React from 'react';
import styles from './SingleEliminationBracketRegion.module.css';
import BracketMatchup_BLANK from './BracketMatchup_BLANK';
import BracketMatchup_INACTIVE from './BracketMatchup_INACTIVE';
import SingleEliminationBracket from './SingleEliminationBracket';

// regular function to just get the log base x of a number y
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}


/***************************
* FOR BRACKET PROPOGRATION *
****************************/
// Check if a certain round (like the round of 64, the round of 32) has already propograted ALL teams back to the next round
function roundIsFull(round) {
    let teamExists = false;
    for(let i in round) {
        if(round[i].team1 !== null || round[i].team2 !== null) {
            teamExists = true;
            break;
        }
    }
    return teamExists;
}

// Get the highest seed in the specified round (like the round of 64, the round of 32)
function highestSeededTeamAndMatchup(round) {
    let highestSeed = 0;
    let matchupNumberAtHiSeed = 0;
    let teamAtHiSeed = 0;

    for(let i in round) {
        // Check if team 1's seed is higher
        if(round[i].team1 > highestSeed) {
            highestSeed = round[i].team1;
            matchupNumberAtHiSeed = i;
            teamAtHiSeed = 'team1';
        }
        // Check if team 2's seed is higher
        if(round[i].team2 > highestSeed) {
            highestSeed = round[i].team2;
            matchupNumberAtHiSeed = i;
            teamAtHiSeed = 'team2';
        }
    }
    // Return data that includes the highest seed, the matchup where that high seed occurs, and the team that the high seed occurs
    return {
        highestSeed: highestSeed,
        matchupNumberAtHiSeed: matchupNumberAtHiSeed,
        teamAtHiSeed: teamAtHiSeed
    }
}
let currentSeed = 2;


/****************************/

const SingleEliminationBracketRegion = ({ data }) => {

    // easy to access user preference
    const seedingOn = data['Seeding'] === 'on' ? true : false;

    console.log(seedingOn);

    const numTeams = data['Participants Per Region'];
    const numRounds = Math.ceil(getBaseLog(2, numTeams))

    let bracket = {};

    // If only 1 team is present in a matchup, label it correctly
    const setSoloTeam = (round, matchup) => {
        if(bracket[round][matchup].team1 === null && bracket[round][matchup].team2 !== null) {
            bracket[round][matchup].soloTeam = true;
        } else if(bracket[round][matchup].team2 === null && bracket[round][matchup].team1 !== null) {
            bracket[round][matchup].soloTeam = true;
        } else if(bracket[round][matchup].team2 !== null && bracket[round][matchup].team1 !== null) {
            bracket[round][matchup].soloTeam = false;
        } else if(bracket[round][matchup].team2 === null && bracket[round][matchup].team1 === null) {
            bracket[round][matchup].soloTeam = false;
        }
    }

    // Initialize an empty bracket with settings at null or false.
    for(let i = 1; i <= numRounds; i++) {
        bracket[i] = {}
        for(let j = 1; j <= (2**i) / 2; j++) {
            bracket[i][j] = {
                team1: null,
                team2: null,
                team1Score: null,
                team2Score: null,
                teamselected: null,
                editable: false,
                showScores: false,
                showWinner: false,
                showSelection: false,
                soloTeam: false,
                won: false,
            }
        }
    }
    
    // Initial condition, seeds 1 and 2 are in the finals
    bracket[1][1].team1 = 1;
    bracket[1][1].team2 = 2;

    // Propogate through bracket started in the finals round to correctly create bye-weeks and seeding
    
    for(let roundNum in bracket) {
        let currentMatchupSpotInEarlierRound = 1;
        
        while(roundIsFull(bracket[roundNum])) {
            if(currentSeed === parseInt(numTeams)) break;

            let highestSeedInfo = highestSeededTeamAndMatchup(bracket[roundNum]);
            let newSeed1 = highestSeedInfo.highestSeed;
            let newSeed2 = parseInt(currentSeed) + 1;
            currentSeed = parseInt(currentSeed) + 1;

            // clear old bracket of any seeding
            bracket[roundNum][highestSeedInfo.matchupNumberAtHiSeed][highestSeedInfo.teamAtHiSeed] = null;
            setSoloTeam(parseInt(roundNum), parseInt(highestSeedInfo.matchupNumberAtHiSeed));

            let seedBeingPropogated = parseInt(highestSeedInfo.highestSeed);
            let numTeamsPrev = 2**(parseInt(roundNum)+1);
            
            let spot = seedBeingPropogated % 2 === 0 && seedBeingPropogated !== 1 ? Math.floor(numTeamsPrev/seedBeingPropogated) : ((numTeamsPrev/2 - parseInt(Math.floor(numTeamsPrev/seedBeingPropogated))) + 1);
            if(seedBeingPropogated === 1) {
                spot = 1;
            }

            // Place data (newSeed1, newSeed2) into next round
            bracket[parseInt(roundNum) + 1][spot].team1 = newSeed1;
            bracket[parseInt(roundNum) + 1][spot].team2 = newSeed2;
            currentMatchupSpotInEarlierRound++;

            console.log(`Seed1: ${newSeed1} Seed2: ${newSeed2}`)
            console.log(`NumTeams: ${numTeamsPrev} Spot: ${spot}`)

            
        }
    }
    console.log(bracket);


    return (
        <div className={styles.container}>
            {
                Object.keys(bracket).map((round, i) => {
                    return (
                        <div className={styles.column}>
                            {
                                Object.keys(bracket[round]).map((matchup, j) => {
                                    return (
                                        <div className={styles.cell}>
                                            {
                                                bracket[round][matchup].oneTeam === true 
                                                ?
                                                    <BracketMatchup_BLANK seedingEnabled={seedingOn} seed1={bracket[round][matchup].team1} oneTeam={true} />
                                                :
                                                    <>
                                                        {
                                                            bracket[round][matchup].team1 === null 
                                                            ?   
                                                                <>
                                                                    {
                                                                        bracket[round][matchup].team2 === null 
                                                                        ?
                                                                            <BracketMatchup_INACTIVE oneTeam={false} />
                                                                        :
                                                                            <BracketMatchup_INACTIVE oneTeam={true} />
 
                                                                    }
                                                                </>
                                                                
                                                            :
                                                                <BracketMatchup_BLANK seedingEnabled={seedingOn} seed1={bracket[round][matchup].team1} seed2={bracket[round][matchup].team2} oneTeam={false} />
                                                        }
                                                    </>
                                            }
                                        </div>
                                    )  
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SingleEliminationBracketRegion