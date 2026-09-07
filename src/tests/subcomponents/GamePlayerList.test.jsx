import {
    calculatePlayerScores,
    getRoundMultiplier,
    getScoreIndex
} from '../../components/subcomponents/function_components/GamePlayerList';

const matchup = (teamselected) => ({ teamselected });

describe('GamePlayerList scoring', () => {
    test('scores four-region rounds, semifinals, and finals without shifting indexes', () => {
        const playBracket = {
            1: { 1: { 1: matchup(1) } },
            2: { 1: { 1: matchup(1) } },
            3: { 1: { 1: matchup(2) } },
            4: { 1: { 1: matchup(2) } },
            semis: { left: matchup(1), right: matchup(2) },
            finals: matchup(2)
        };
        const playerBrackets = [{
            cur_uid: 'player-1',
            bracket: {
                bracket: {
                    1: { 1: { 1: matchup(1) } },
                    2: { 1: { 1: matchup(1) } },
                    3: { 1: { 1: matchup(2) } },
                    4: { 1: { 1: matchup(1) } },
                    semis: { left: matchup(1), right: matchup(1) },
                    finals: matchup(null)
                }
            }
        }];

        const scores = calculatePlayerScores(playerBrackets, playBracket, 1, 4);

        expect(scores['player-1'][1].score).toBe(3);
        expect(scores['player-1'][0].score).toBe(1);
        expect(scores['player-1'][-1].score).toBe(0);
        expect(getScoreIndex(4, 2)).toBe(1);
        expect(getRoundMultiplier(4, 1, 0)).toBe(4);
    });

    test('does not award points for undecided results', () => {
        const playBracket = {
            1: { 1: { 1: matchup(null) } },
            2: { 1: { 1: matchup(null) } },
            3: { 1: { 1: matchup(null) } },
            4: { 1: { 1: matchup(null) } },
            semis: { left: matchup(null), right: matchup(null) },
            finals: matchup(null)
        };
        const playerBrackets = [{
            cur_uid: 'player-1',
            bracket: { bracket: JSON.parse(JSON.stringify(playBracket)) }
        }];

        const scores = calculatePlayerScores(playerBrackets, playBracket, 1, 4);

        expect(scores['player-1'][1].score).toBe(0);
        expect(scores['player-1'][0].score).toBe(0);
        expect(scores['player-1'][-1].score).toBe(0);
    });
});
