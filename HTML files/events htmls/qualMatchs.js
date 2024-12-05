var week1STD = 20.730805684966178;
async function populateTable() {
    const tableBody = document.querySelector("#qual-matches-table tbody");
    var eventInfo = await getEventInfo();
    console.log(eventInfo)
    // Clear existing rows (if any)
    tableBody.innerHTML = "";
    var schedule = eventInfo.schedule;
    matchData = [];
    console.log(schedule.length)

    for (let i = 0; i < schedule.length; i++) {
        var red1;
        var red2;
        var blue1;
        var blue2;
        for (let j = 0; j < schedule[i].teams.length; j++) {
            switch (schedule[i].teams[j].station) {
                case "Red1":
                    red1 = schedule[i].teams[j].teamNumber;
                    break;
                case "Red2":
                    red2 = schedule[i].teams[j].teamNumber;
                    break;
                case "Blue1":
                    blue1 = schedule[i].teams[j].teamNumber;
                    break;
                case "Blue2":
                    blue2 = schedule[i].teams[j].teamNumber;
                    break;
                default:
                    // Optional: Handle any unexpected station values here
                    console.warn(`Unexpected station: ${schedule[i].teams[j].station}`);
                    break;
            }
        }
        let winner = null
        let blueScore = ""
        let redScore = ""
        if (null !== schedule[i].scoreBlueFinal && null !== schedule[i].scoreRedFinal) {
            blueScore = schedule[i].scoreBlueFinal
            redScore = schedule[i].scoreRedFinal
            if (blueScore < redScore) {
                winner = "Red"
            } else if (blueScore > redScore) {
                winner = "Blue"
            }
        }
        matchData.push({
            "Match Number": "Qual " + (i + 1),
            "Red1": red1,
            "Red2": red2,
            "Blue1": blue1,
            "Blue2": blue2,
            "Red Score": redScore,
            "Blue Score": blueScore,
            "Red Pred Score": 0,
            "Blue Pred Score": 0,
            "Predicted Team Win": "Blue",
            "win percentage": 50 + "%",
            "winner": winner
        })
    }
    // Loop through the data and create rows
    matchData.forEach(match => {
        const row = document.createElement("tr");

        // Create cells for each data point with specific styles
        Object.values(match).forEach((value, index) => {
            if (index < 11) {
                const cell = document.createElement("td");

                // Apply style based on index or value for the specific cells
                if (index === 1 || index === 2) {
                    // Apply style for the second and third cells (e.g., 4338, 4320)
                    cell.style.backgroundColor = "rgb(255, 238, 238)";
                    cell.style.color = "rgb(29 78 216)";
                    if (match["winner"] == "Red") {
                        cell.style.fontWeight = "Bold"
                    }
                } else if (index === 3 || index === 4) {
                    // Apply style for the fourth and fifth cells (e.g., 4319, 1690)
                    cell.style.backgroundColor = "rgb(238, 238, 255)";
                    cell.style.color = "rgb(29 78 216)";
                    if (match["winner"] == "Blue") {
                        cell.style.fontWeight = "Bold"
                    }
                } else if (index === 5) {
                    cell.style.backgroundColor = "rgb(255, 238, 238)";
                    cell.style.width = "9%"
                    if (match["winner"] == "Red") {
                        cell.style.fontWeight = "Bold"
                    }
                } else if (index === 6) {
                    cell.style.backgroundColor = "rgb(238, 238, 255)";
                    cell.style.width = "9%"
                    if (match["winner"] == "Blue") {
                        cell.style.fontWeight = "Bold"
                    }
                } else if (index === 7) {
                    cell.style.backgroundColor = "rgb(255, 238, 238)";
                    cell.style.width = "9%"
                } else if (index === 8) {
                    cell.style.backgroundColor = "rgb(238, 238, 255)";
                    cell.style.width = "9%"
                }

                // Set the text content of the cell
                cell.textContent = value;

                // Append the cell to the row
                row.appendChild(cell);
            }
        });

        // Append the row to the table body
        tableBody.appendChild(row);
    });
    return matchData
}
async function fetchAndPopulateTable() {

    try {
        populateTable(); // Populate the table
    } catch (error) {
        console.error("Error fetching the JSON data:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fetchAndPopulateTable();
});

async function getSOS() {
    const data = await generateRankings();
    const matchData = await populateTable(data);
    const sortedTeams = Object.entries(data)
        .filter(([key, value]) => !isNaN(value)) // Remove NaN values
        .sort((a, b) => b[1] - a[1]);
    var teamAverageResults = {};
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

    leagueTeams.forEach(team => {
        teamAverageResults[team] = { "average wins": 0, "SOS": 0, "rank": 0 }
    });
    console.log(teamAverageResults)
    for (let _ = 0; _ < 10000; _++) {
        for (let i = 0; i < matchData.length; i++) {
            if (i < 20) {
                if (matchData[i]["actual score diff"] < 0) {
                    teamAverageResults[matchData[i]["Blue1"]]["average wins"]++;
                    teamAverageResults[matchData[i]["Blue2"]]["average wins"]++;
                } else {
                    teamAverageResults[matchData[i]["Red1"]]["average wins"]++;
                    teamAverageResults[matchData[i]["Red2"]]["average wins"]++;
                }
                continue;
            }
            var win = Math.random();
            if (win < parseInt(matchData[i]["win percentage"]) / 100) {
                if (matchData[i]["score diff"] < 0) {
                    // console.log(matchData[i]["Blue1"])
                    // console.log(teamAverageResults[matchData[i]["Blue1"]]["average wins"]);
                    teamAverageResults[matchData[i]["Blue1"]]["average wins"]++;
                    teamAverageResults[matchData[i]["Blue2"]]["average wins"]++;
                } else {
                    teamAverageResults[matchData[i]["Red1"]]["average wins"]++;
                    teamAverageResults[matchData[i]["Red2"]]["average wins"]++;
                }
            } else {
                console.log("UPset")
                if (matchData[i]["score diff"] > 0) {
                    teamAverageResults[matchData[i]["Blue1"]]["average wins"]++;
                    teamAverageResults[matchData[i]["Blue2"]]["average wins"]++;
                } else {
                    teamAverageResults[matchData[i]["Red1"]]["average wins"]++;
                    teamAverageResults[matchData[i]["Red2"]]["average wins"]++;
                }
            }
        }
        // console.log(_);
    }
    console.log(teamAverageResults)
    for (let team of leagueTeams) {
        teamAverageResults[team]["average wins"] /= 10000;
    }
    console.log(teamAverageResults)
    const sortedLeagueRank = Object.entries(teamAverageResults)
        .sort(([, a], [, b]) => b["average wins"] - a["average wins"]);
    for (let i = 0; i < sortedLeagueRank.length; i++) {
        teamAverageResults[sortedLeagueRank[i][0]]["rank"] = i;
    }
    for (let i = 0; i < sortedTeams.length; i++) {
        teamAverageResults[sortedTeams[i][0]]["SOS"] = i - teamAverageResults[sortedTeams[i][0]]["rank"]
    }
    const sortedSOS = Object.entries(teamAverageResults)
        .sort(([, a], [, b]) => b["SOS"] - a["SOS"]);
    console.log(sortedLeagueRank);
    console.log(sortedSOS)
    console.log(sortedTeams)
    const csvContent = convertToCSV(sortedLeagueRank);
    downloadCSV("teams_data.csv", csvContent);
}

function convertToCSV(data) {
    // CSV header
    let csvContent = "Team,Average Wins,SOS,Rank\n";

    // Add each row of data
    data.forEach(row => {
        const team = row[0];
        const stats = row[1];
        csvContent += `${team},${stats["average wins"]},${stats.SOS},${stats.rank}\n`;
    });

    return csvContent;
}

function downloadCSV(filename, content) {
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    // document.body.removeChild(a);
}