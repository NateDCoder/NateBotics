async function createHTMLS() {
    var leagueTeams = [
        '7360', '8492', '11617', '11618',
        '11679', '11729', '26293', '27155',
        '14015', '9895', '8511', '10644',
        '10645', '15555', '26266', '19925',
        '26538', '26606', '10735', '11193',
        '13748', '19770', '8142', '8656',
        '8734', '9458', '14018', '27277',
        '6811', '10552'
    ];
    
    var eloRatings = {};
    var eloRatingsOverTime = {};
    // await getMatchInfo(await getAllEvents())
    leagueTeams.forEach(team => {
        eloRatings[team] = 1500; // Assign random Elo values
    });
    leagueTeams.forEach(team => {
        eloRatingsOverTime[team] = []; // Assign random Elo values
    });
    for (let team of leagueTeams) {
        eloRatingsOverTime[team].push(1500)
    }

    var week1STD = 20.730805684966178;
    console.log(week1STD)
    var matchInfo = await fetchJSONData("./data/Match Info.json");
    for (let i = 0; i < matchInfo.length; i++) {
        console.log(matchInfo.length)
        var match = matchInfo[i]
        var redTeam = match.redTeams;
        var blueTeam = match.blueTeams;
        if (redTeam[0]==null) continue;
        var redScore = match.redScore;
        var blueScore = match.blueScore;
        var redElo = eloRatings[redTeam[0]] + eloRatings[redTeam[1]]
        var blueElo = eloRatings[blueTeam[0]] + eloRatings[blueTeam[1]]

        var predictedScoreMargin = 0.004 * (redElo - blueElo);
        var actualScoreMargin = (redScore - blueScore) / week1STD;
        var eloDelta = 12 * (actualScoreMargin - predictedScoreMargin)

        eloRatings[redTeam[0]] += eloDelta;
        eloRatings[redTeam[1]] += eloDelta;

        eloRatings[blueTeam[0]] -= eloDelta;
        eloRatings[blueTeam[1]] -= eloDelta;
        console.log(match)
        eloRatingsOverTime[redTeam[0]].push(Math.floor(eloRatings[redTeam[0]]))
        eloRatingsOverTime[redTeam[1]].push(Math.floor(eloRatings[redTeam[1]]))

        eloRatingsOverTime[blueTeam[0]].push(Math.floor(eloRatings[blueTeam[0]]))
        eloRatingsOverTime[blueTeam[1]].push(Math.floor(eloRatings[blueTeam[1]]))
    }

    const sortedTeams = Object.entries(eloRatings)
        .filter(([key, value]) => !isNaN(value)) // Remove NaN values
        .sort((a, b) => a[1] - b[1]); // Sort by value in ascending order
    console.log(eloRatingsOverTime)
    // writeFile('Elo Rating Over Time.json', JSON.stringify(eloRatingsOverTime, null, 2))
    console.log(week1STD)
}

async function fetchJSONData(filePath) {
    try {
        const res = await fetch(filePath);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Unable to fetch data:", error);
    }
}   