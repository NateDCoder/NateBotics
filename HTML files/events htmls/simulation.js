// const labels = [
//     "Before Schedule Release",
//     "Schedule Release",
//     "After Schedule Release",
//     "Qual Match 1",
//     "Qual Match 2",
//     "Qual Match 3"
// ];

// const slider = document.getElementById("slider");
// const sliderLabel = document.getElementById("slider-label");
// // Update label based on slider value
// slider.addEventListener("input", () => {
//     const value = slider.value;
//     sliderLabel.innerHTML = `Simulate from: <strong>${labels[value]}</strong>`;
// });

async function fetchAndPopulateSimulation() {
    let eventInfo = await getEventInfo();
    let teamToEPA = await fetchTeamToEPA();

    let simulationData = await getSimulationData(eventInfo, teamToEPA)
    console.log(simulationData)
    populateSimulation(simulationData);
}
function simulateMatches(schedule, teams, teamToEPA) {

    let teamPredictedRanks = {}
    for (let team of teams) {
        teamPredictedRanks[team] = { "Average Rank": 0, "List of Ranks": [] }
    }
    for (let i = 0; i < 1000; i++) {
        console.log(i)
        let matchSimulation = {}
        for (let team of teams) {
            matchSimulation[team] = { "Wins": 0, "Auto EPA": 0 }
        }
        for (let match of schedule) {
            var red1;
            var red2;
            var blue1;
            var blue2;
            for (let j = 0; j < match.teams.length; j++) {
                switch (match.teams[j].station) {
                    case "Red1":
                        red1 = match.teams[j].teamNumber;
                        break;
                    case "Red2":
                        red2 = match.teams[j].teamNumber;
                        break;
                    case "Blue1":
                        blue1 = match.teams[j].teamNumber;
                        break;
                    case "Blue2":
                        blue2 = match.teams[j].teamNumber;
                        break;
                    default:
                        // Optional: Handle any unexpected station values here
                        console.warn(`Unexpected station: ${schedule[i].teams[j].station}`);
                        break;
                }
            }
            let blueScore;
            let blueAuton;

            let redScore;
            let redAuton;

            let redWinPercentage = null;
            if (match.scoreBlueFinal !== null) {
                blueScore = match.scoreBlueFinal;
                redScore = match.scoreRedFinal;

                blueAuton = match.scoreBlueAuto;
                redAuton = match.scoreRedAuto;
            } else {
                redWinPercentage = 1 / (1 + Math.pow(10, ((teamToEPA[blue1]["Elo"] + teamToEPA[blue2]["Elo"]) - (teamToEPA[red1]["Elo"] + teamToEPA[red2]["Elo"])) / 400))
                blueAuton = teamToEPA[blue1]["Auto EPA"] + teamToEPA[blue2]["Auto EPA"]
                redAuton = teamToEPA[red1]["Auto EPA"] + teamToEPA[red2]["Auto EPA"]
            }
            if (redWinPercentage !== null) {
                if (Math.random() < redWinPercentage) {
                    matchSimulation[red1]["Wins"]++;

                    matchSimulation[red2]["Wins"]++;

                } else {
                    matchSimulation[blue1]["Wins"]++;

                    matchSimulation[blue2]["Wins"]++;

                }

            } else {
                if (redScore < blueScore) {
                    matchSimulation[blue1]["Wins"]++;
                    matchSimulation[blue2]["Wins"]++;
                } else {
                    matchSimulation[red1]["Wins"]++;
                    matchSimulation[red2]["Wins"]++;
                }
            }
            matchSimulation[blue1]["Auto EPA"] += blueAuton;
            matchSimulation[blue2]["Auto EPA"] += blueAuton;

            matchSimulation[red1]["Auto EPA"] += redAuton;
            matchSimulation[red2]["Auto EPA"] += redAuton;
        }

        const teamsArray = Object.entries(matchSimulation).map(([teamNumber, stats]) => ({
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
            return b["Auto EPA"] - a["Auto EPA"];
        });
        console.log(teamsArray)
        teamsArray.forEach((team, index) => {
            teamPredictedRanks[team["teamNumber"]]["Average Rank"] += index + 1
            teamPredictedRanks[team["teamNumber"]]["List of Ranks"].push(index + 1);
        })
    }
    for (let team of teams) {
        teamPredictedRanks[team]["List of Ranks"].sort(
            (a, b) => {
                // Sort by Rank (ascending)
                return a - b;
            })
        teamPredictedRanks[team]["Average Rank"] /= 1000;
    }
    const predictedRanks = Object.entries(teamPredictedRanks).map(([teamNumber, stats]) => ({
        Number: parseInt(teamNumber),
        ...stats
    }));
    predictedRanks.sort(
        (a, b) => {
            // Sort by Rank (ascending)
            return a["Average Rank"] - b["Average Rank"];
        })
    return predictedRanks

}
async function fetchTeamToEPA() {
    const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/Team_List');
    const data = await response.json();
    let teamToEPA = {};
    for (let team of data) {
        teamToEPA[team["Number"]] = { "Auto EPA": team["Auto EPA"], "EPA": team["EPA"], "Elo": Math.round(team["Unitless EPA"]) }
    }
    return teamToEPA;
}
async function getSimulationData(eventInfo, teamToEPA) {
    let schedule = eventInfo.schedule;
    console.log(eventInfo)
    let teams = eventInfo.teams;
    var teamData = [];
    let i = 1;
    let otherTeamData = {}
    for (let team of eventInfo.preEloTeamList) {
        otherTeamData[team["Number"]] = { "EPA Rank": team["EPA Rank"], "Name": team["Name"], "epa": Math.round(team["EPA"] * 10) / 10 }
    }
    console.log(schedule, teams, teamToEPA)
    let simulatedRankings = simulateMatches(schedule, teams, teamToEPA);
    console.log(simulatedRankings)
    for (let team of simulatedRankings) {
        teamData.push({
            "Predicted Rank": i,
            "Number": team["Number"],
            "Name": otherTeamData[team["Number"]]["Name"],
            "epa": otherTeamData[team["Number"]]["epa"],
            "Mean Rank": team["Average Rank"],
            "5% Rank": team["List of Ranks"][50],
            "Median Rank": team["List of Ranks"][500],
            "95% Rank": team["List of Ranks"][950],
            "EPA Rank": otherTeamData[team["Number"]]["EPA Rank"]
        })
        i++;
    }
    console.log(teamData)
    return teamData
}

function populateSimulation(data) {
    console.log(data)
    const tableBody = document.querySelector("#simulation-table tbody");

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
                if (index === 2) {  // 0-based index, so 1 is the second row
                    const link = document.createElement("a");
                    link.href = "../team htmls/" + team["Number"] + ".html";  // Set the desired link
                    link.textContent = value;  // Add the value as the link text
                    cell.appendChild(link);
                } else if (3 == index) {
                    const div = document.createElement("div");
                    let rank;
                    switch (index) {
                        case 3:
                            rank = "EPA Rank"
                            break;
                    }
                    let percentile = 1 - team[rank] / totalAmountOfTeams;
                    div.className = getColorClassStyle(percentile);
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