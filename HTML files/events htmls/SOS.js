async function populateSOS() {
    let eventInfo = await getEventInfo();
    addSOSDataToTable(await getSOSData(eventInfo));
}
function getTotalMatchesPerTeam(eventInfo) {
    let teamStorage = {}
    for (let team of eventInfo.teams) {
        teamStorage[team] = { "Matches Played": 0 }
    }

    for (let match of eventInfo.schedule) {
        
        for (let team of match.teams) {
            teamStorage[team.teamNumber]["Matches Played"]++;
            
        }


    }
    let matchesPlayed = []
    for (let team of eventInfo.teams) {
        matchesPlayed.push(teamStorage[team]["Matches Played"])
    }
    const averagePlayed = matchesPlayed.reduce((a, b) => a + b) / matchesPlayed.length;
    return averagePlayed;
}
async function getSOSData(eventInfo) {
    let matchesPlayed = getTotalMatchesPerTeam(eventInfo)
    var teamData = [];
    let SOSData = {};
    for (let team of eventInfo.teams) {
        SOSData[team] = { "Matches Played": 0, "Wins": 0, "Average EPA": 0, "Average Auton": 0, "EPA Difference": 0 }
    }
    let teamToEPA = {};
    let teamToAuto = {}
    eventInfo.afterEloTeamList.forEach(team =>
        teamToEPA[team["Number"]] = team["EPA"]
    )
    eventInfo.afterEloTeamList.forEach(team =>
        teamToAuto[team["Number"]] = team["Auto EPA"]
    )
    let scores = []
    for (let match of eventInfo.schedule) {
        let redTeams = [];
        let blueTeams = [];
        let blueScore = match.scoreBlueFinal;
        let redScore = match.scoreRedFinal;
        scores.push(blueScore);
        scores.push(redScore);
        for (let team of match.teams) {
            updateTeamMatchData(SOSData, team, redTeams, blueTeams, redScore, blueScore, matchesPlayed)

        }
        let redTeamEPA = teamToEPA[redTeams[0]] + teamToEPA[redTeams[1]]
        let blueTeamEPA = teamToEPA[blueTeams[0]] + teamToEPA[blueTeams[1]]

        SOSData[redTeams[0]]["Average EPA"] += redTeamEPA
        SOSData[redTeams[1]]["Average EPA"] += redTeamEPA

        SOSData[blueTeams[0]]["Average EPA"] += blueTeamEPA
        SOSData[blueTeams[1]]["Average EPA"] += blueTeamEPA

        SOSData[redTeams[0]]["EPA Difference"] += redTeamEPA - blueTeamEPA
        SOSData[redTeams[1]]["EPA Difference"] += redTeamEPA - blueTeamEPA

        SOSData[blueTeams[0]]["EPA Difference"] += blueTeamEPA - redTeamEPA
        SOSData[blueTeams[1]]["EPA Difference"] += blueTeamEPA - redTeamEPA

        let redTeamAuto = teamToAuto[redTeams[0]] + teamToAuto[redTeams[1]]
        let blueTeamAuto = teamToAuto[blueTeams[0]] + teamToAuto[blueTeams[1]]

        SOSData[redTeams[0]]["Average Auton"] += redTeamAuto
        SOSData[redTeams[1]]["Average Auton"] += redTeamAuto

        SOSData[blueTeams[0]]["Average Auton"] += blueTeamAuto
        SOSData[blueTeams[1]]["Average Auton"] += blueTeamAuto


    }
    eventInfo.afterEloTeamList.forEach(team => {
        SOSData[team["Number"]]["Average Auton"] /= SOSData[team["Number"]]["Matches Played"]
        SOSData[team["Number"]]["Average EPA"] /= SOSData[team["Number"]]["Matches Played"]
        SOSData[team["Number"]]["EPA Difference"] /= SOSData[team["Number"]]["Matches Played"]
    })
    const teamsArray = Object.entries(SOSData).map(([teamNumber, stats]) => ({
        teamNumber: parseInt(teamNumber),
        ...stats
    }));

    // Sort array by Wins first, then Average EPA
    teamsArray.sort((a, b) => {
        // Sort by Wins (descending)
        if (b.Wins !== a.Wins) {
            return b.Wins - a.Wins;
        }
        // If Wins are equal, sort by Average EPA (descending)
        return b["Average Auton"] - a["Average Auton"];
    });
    let teamToRank = {};
    teamsArray.forEach((team, index) => {
        teamToRank[team["teamNumber"]] = index + 1
    })
    let SOSTeamData = await simulateMatches(eventInfo, SOSData, teamToEPA, teamToAuto, teamToRank, calculateStandardDeviation(scores), matchesPlayed)

    for (let team of eventInfo.afterEloTeamList) {
        teamData.push({
            "Rank": teamToRank[team["Number"]],
            "number": team["Number"],
            "name": team["Name"],
            "epa": Math.round(team["EPA"] * 10) / 10,
            "EPA Toughness": SOSTeamData[team["Number"]]["EPA Toughness"],
            "Rank Score": SOSTeamData[team["Number"]]["Rank Score"],
            "EPA Score": SOSTeamData[team["Number"]]["EPA Score"],
            "Composite Score": SOSTeamData[team["Number"]]["Composite"],
            "EPA Rank": team["EPA Rank"]
        })
    }
    return teamData;
}
function updateTeamMatchData(matchData, team, redTeams, blueTeams, redScore, blueScore, matchesPlayed) {
    matchData[team.teamNumber]["Matches Played"]++;
    switch (team.station) {
        case "Red1":
            redTeams.push(team.teamNumber);
            if (matchData[team.teamNumber]["Matches Played"] <= matchesPlayed && blueScore < redScore) {
                matchData[team.teamNumber]["Wins"]++;
            }
            break;
        case "Red2":
            redTeams.push(team.teamNumber);
            if (matchData[team.teamNumber]["Matches Played"] <= matchesPlayed && blueScore < redScore) {
                matchData[team.teamNumber]["Wins"]++;
            }
            break;
        case "Blue1":
            blueTeams.push(team.teamNumber);
            if (matchData[team.teamNumber]["Matches Played"] <= matchesPlayed && blueScore > redScore) {
                matchData[team.teamNumber]["Wins"]++;
            }
            break;
        case "Blue2":
            if (matchData[team.teamNumber]["Matches Played"] <= matchesPlayed && blueScore > redScore) {
                matchData[team.teamNumber]["Wins"]++;
            }
            blueTeams.push(team.teamNumber)
            break;
    }
}
async function simulateMatches(eventInfo, SOSData, teamToEPA, teamToAuto, teamToRank, STD, matchesPlayed) {
    let simulationData = {};
    for (let team of eventInfo.teams) {
        simulationData[team] = { "EPA Toughness": 0, "Rank Score": 0, "EPA Score": 0, "Composite": 0 }
    }
    let schedule = await getSchedule();
    let listOfTeams = eventInfo.teams;
    for (let i = 0; i < 1000; i++) {
        shuffle(listOfTeams);
        let simulatedSOSData = {};
        for (let team of listOfTeams) {
            simulatedSOSData[team] = { "Matches Played": 0, "Wins": 0, "Average EPA": 0, "Average Auton": 0, "EPA Difference": 0 }
        }
        for (let teamsInMatch of schedule) {
            let red1 = listOfTeams[teamsInMatch[0] - 1]
            let red2 = listOfTeams[teamsInMatch[1] - 1]

            let blue1 = listOfTeams[teamsInMatch[2] - 1]
            let blue2 = listOfTeams[teamsInMatch[3] - 1]

            simulatedSOSData[red1]["Matches Played"]++;
            simulatedSOSData[red2]["Matches Played"]++;

            simulatedSOSData[blue1]["Matches Played"]++;
            simulatedSOSData[blue2]["Matches Played"]++;

            let redTeamEPA = teamToEPA[red1] + teamToEPA[red2]
            let blueTeamEPA = teamToEPA[blue1] + teamToEPA[blue2]

            let winPercentage = 1 / (1 + Math.pow(10, (blueTeamEPA - redTeamEPA) / STD))
            if (Math.random() < winPercentage) {
                if (simulatedSOSData[red1]["Matches Played"] <= matchesPlayed) {
                    simulatedSOSData[red1]["Wins"]++;
                }
                if (simulatedSOSData[red2]["Matches Played"] <= matchesPlayed) {
                    simulatedSOSData[red2]["Wins"]++;
                }
            } else {
                if (simulatedSOSData[blue1]["Matches Played"] <= matchesPlayed) {
                    simulatedSOSData[blue1]["Wins"]++;
                }
                if (simulatedSOSData[blue2]["Matches Played"] <= matchesPlayed) {
                    simulatedSOSData[blue2]["Wins"]++;
                }
            }

            simulatedSOSData[red1]["Average EPA"] += redTeamEPA;
            simulatedSOSData[red2]["Average EPA"] += redTeamEPA;

            simulatedSOSData[blue1]["Average EPA"] += blueTeamEPA;
            simulatedSOSData[blue2]["Average EPA"] += blueTeamEPA;

            simulatedSOSData[red1]["EPA Difference"] += redTeamEPA - blueTeamEPA
            simulatedSOSData[red2]["EPA Difference"] += redTeamEPA - blueTeamEPA

            simulatedSOSData[blue1]["EPA Difference"] += blueTeamEPA - redTeamEPA
            simulatedSOSData[blue2]["EPA Difference"] += blueTeamEPA - redTeamEPA

            let redTeamAuto = teamToAuto[red1] + teamToAuto[red2]
            let blueTeamAuto = teamToAuto[blue1] + teamToAuto[blue2]

            simulatedSOSData[red1]["Average Auton"] += redTeamAuto
            simulatedSOSData[red2]["Average Auton"] += redTeamAuto

            simulatedSOSData[blue1]["Average Auton"] += blueTeamAuto
            simulatedSOSData[blue2]["Average Auton"] += blueTeamAuto

        }
        eventInfo.afterEloTeamList.forEach(team => {
            simulatedSOSData[team["Number"]]["Average Auton"] /= simulatedSOSData[team["Number"]]["Matches Played"]
            simulatedSOSData[team["Number"]]["Average EPA"] /= simulatedSOSData[team["Number"]]["Matches Played"]
            simulatedSOSData[team["Number"]]["EPA Difference"] /= simulatedSOSData[team["Number"]]["Matches Played"]
        })
        const teamsArray = Object.entries(simulatedSOSData).map(([teamNumber, stats]) => ({
            teamNumber: parseInt(teamNumber),
            ...stats
        }));
        // Sort array by Wins first, then Average EPA
        teamsArray.sort((a, b) => {
            // Sort by Wins (descending)
            if (b.Wins !== a.Wins) {
                return b.Wins - a.Wins;
            }
            // If Wins are equal, sort by Average EPA (descending)
            return b["Average Auton"] - a["Average Auton"];
        });
        for (let i = 0; i < teamsArray.length; i++) {
            let team = teamsArray[i];
        }
        teamsArray.forEach((team, index) => {
            simulatedSOSData[team["teamNumber"]]["Rank"] = index + 1
        })
        for (let team of listOfTeams) {
            if (SOSData[team]["EPA Difference"] < simulatedSOSData[team]["EPA Difference"]) {
                simulationData[team]["EPA Toughness"]++;
            }
            if (teamToRank[team] > simulatedSOSData[team]["Rank"]) {
                simulationData[team]["Rank Score"]++;
            }else if (teamToRank[team] == simulatedSOSData[team]["Rank"]) {
                simulationData[team]["Rank Score"]+=0.5;
            }
            if (SOSData[team]["Average EPA"] < simulatedSOSData[team]["Average EPA"]) {
                simulationData[team]["EPA Score"]++;
            }
        }

    }
    for (let team of listOfTeams) {
        simulationData[team]["EPA Toughness"] /= 1000;
        simulationData[team]["Rank Score"] /= 1000;
        simulationData[team]["EPA Score"] /= 1000;
        simulationData[team]["Composite"] = Math.round(1000 * ((simulationData[team]["EPA Toughness"] + simulationData[team]["Rank Score"] + simulationData[team]["EPA Score"]) / 3)) / 1000;

    }
    return simulationData
}
function addSOSDataToTable(data) {
    const tableBody = document.querySelector("#sos-table tbody");

    // Clear existing rows (if any)
    tableBody.innerHTML = "";
    const totalAmountOfTeams = 533
    // Loop through the data and create rows
    for (let team of data) {
        const row = document.createElement("tr");

        // Create cells for each data point
        Object.values(team).forEach((value, index) => {
            if (index < 8) {
                const cell = document.createElement("td");

                // Check if this is the second row
                if (index === 1) {  // 0-based index, so 1 is the second row
                    const link = document.createElement("a");
                    link.href = "./team htmls/" + value + ".html";  // Set the desired link
                    link.textContent = value;  // Add the value as the link text
                    cell.appendChild(link);
                } else if (3 <= index && index <= 3) {
                    const div = document.createElement("div");
                    let rank = "EPA Rank";
                    let percentile = 1 - team[rank] / totalAmountOfTeams;

                    div.className = getColorClassStyle(percentile);

                    div.textContent = value
                    cell.appendChild(div)
                }
                else if (4 <= index && index <= 7) {
                    const div = document.createElement("div");

                    if (value > 0.66) {
                        div.className = "red-style"
                    } else if (value > 0.33) {
                        div.className = "white-style"
                    } else {
                        div.className = "light-green-style"
                    }
                    div.textContent = value
                    cell.appendChild(div)
                }
                else {
                    cell.textContent = value;  // For other rows, just set text content
                }
                row.appendChild(cell);
            }
        });

        // Append the row to the table body
        tableBody.appendChild(row);
    }
    sortTable(0, "sos-table")
    sortTable(0, "sos-table")
}