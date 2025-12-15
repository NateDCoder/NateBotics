async function populateQualMatches(year, eventCode) {
    const tableBody = document.querySelector("#qual-matches-table tbody");
    var eventInfo = await fetchEventDetails(year, eventCode);
    var qualMatches = await fetchQualMatches(year, eventCode);
    // Clear existing rows (if any)
    tableBody.innerHTML = "";
    matchData = [];
    let correctGuess = 0;
    for (let i = 0; i < qualMatches.length; i++) {
        var match = qualMatches[i];
        var red1 = match.redTeams[0];
        var red2 = match.redTeams[1];
        var blue1 = match.blueTeams[0];
        var blue2 = match.blueTeams[1];

        matchData.push({
            "Match Number": "Qual " + (i + 1),
            Red1: red1,
            Red2: red2,
            Blue1: blue1,
            Blue2: blue2,
            "Red Score": match.pointBreakdown.redData.redScore,
            "Blue Score": match.pointBreakdown.blueData.blueScore,
            "Red Pred Score": Math.round(match.predictedScores.redEPA),
            "Blue Pred Score": Math.round(match.predictedScores.blueEPA),
            "Predicted Team Win": match.predictedWinner,
            "Win Percentage": Math.round(100 * match.winProbability) + "%",
            winner: match.actualWinner,
            "Guessed Right": match.predictedWinner == match.actualWinner,
        });
        if (match.predictedWinner == match.actualWinner) {
            correctGuess++;
        }
    }
    let divContainer = document.getElementById("qual-matches");
    let winPredictionPercentagesDiv = document.createElement("div");
    winPredictionPercentagesDiv.innerHTML =
        "<strong>Accuracy: " +
        Math.round(1000 * (correctGuess / qualMatches.length)) / 10 +
        "%</strong>";
    winPredictionPercentagesDiv.style.textAlign = "left";
    winPredictionPercentagesDiv.style.marginLeft = "12%";
    winPredictionPercentagesDiv.style.marginTop = "1%";
    divContainer.insertBefore(winPredictionPercentagesDiv, divContainer.children[2]);
    // Loop through the data and create rows
    matchData.forEach((match) => {
        const row = document.createElement("tr");

        // Create cells for each data point with specific styles
        Object.values(match).forEach((value, index) => {
            if (index < 11) {
                const cell = document.createElement("td");

                // Apply style based on index or value for the specific cells
                switch (index) {
                    case 1:
                    case 2:
                        // Apply style for the second and third cells (e.g., 4338, 4320)
                        cell.style.backgroundColor = "rgb(255, 238, 238)";
                        cell.style.color = "rgb(29 78 216)";
                        if (match["winner"] == "Red") {
                            cell.style.fontWeight = "Bold";
                        }
                        break;
                    case 3:
                    case 4:
                        // Apply style for the fourth and fifth cells (e.g., 4319, 1690)
                        cell.style.backgroundColor = "rgb(238, 238, 255)";
                        cell.style.color = "rgb(29 78 216)";
                        if (match["winner"] == "Blue") {
                            cell.style.fontWeight = "Bold";
                        }
                        break;
                    case 5:
                        // Apply style for the fourth and fifth cells (e.g., 4319, 1690)
                        cell.style.backgroundColor = "rgb(255, 238, 238)";
                        cell.style.width = "9%";
                        if (match["winner"] == "Red") {
                            cell.style.fontWeight = "Bold";
                        }
                        break;
                    case 6:
                        cell.style.backgroundColor = "rgb(238, 238, 255)";
                        cell.style.width = "9%";
                        if (match["winner"] == "Blue") {
                            cell.style.fontWeight = "Bold";
                        }
                        break;
                    case 7:
                        cell.style.backgroundColor = "rgb(255, 238, 238)";
                        cell.style.width = "9%";
                        break;
                    case 8:
                        cell.style.backgroundColor = "rgb(238, 238, 255)";
                        cell.style.width = "9%";
                        break;
                    case 10:
                        cell.style.backgroundColor = match["Guessed Right"]
                            ? "rgb(134, 207, 163)"
                            : "rgb(247, 127, 132)";
                        break;
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
}

async function getSOS() {
    const data = await generateRankings();
    const matchData = await populateTable(data);
    const sortedTeams = Object.entries(data)
        .filter(([key, value]) => !isNaN(value)) // Remove NaN values
        .sort((a, b) => b[1] - a[1]);
    var teamAverageResults = {};
    var leagueTeams = [
        "7360",
        "8492",
        "11617",
        "11618",
        "11679",
        "11729",
        "26293",
        "27155",
        "14015",
        "9895",
        "8511",
        "10644",
        "10645",
        "15555",
        "26266",
        "19925",
        "26538",
        "26606",
        "10735",
        "11193",
        "13748",
        "19770",
        "8142",
        "8656",
        "8734",
        "9458",
        "14018",
        "27277",
        "6811",
        "10552",
    ];

    leagueTeams.forEach((team) => {
        teamAverageResults[team] = { "average wins": 0, SOS: 0, rank: 0 };
    });
    console.log(teamAverageResults);
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
                console.log("UPset");
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
    console.log(teamAverageResults);
    for (let team of leagueTeams) {
        teamAverageResults[team]["average wins"] /= 10000;
    }
    console.log(teamAverageResults);
    const sortedLeagueRank = Object.entries(teamAverageResults).sort(
        ([, a], [, b]) => b["average wins"] - a["average wins"]
    );
    for (let i = 0; i < sortedLeagueRank.length; i++) {
        teamAverageResults[sortedLeagueRank[i][0]]["rank"] = i;
    }
    for (let i = 0; i < sortedTeams.length; i++) {
        teamAverageResults[sortedTeams[i][0]]["SOS"] =
            i - teamAverageResults[sortedTeams[i][0]]["rank"];
    }
    const sortedSOS = Object.entries(teamAverageResults).sort(
        ([, a], [, b]) => b["SOS"] - a["SOS"]
    );
    console.log(sortedLeagueRank);
    console.log(sortedSOS);
    console.log(sortedTeams);
    const csvContent = convertToCSV(sortedLeagueRank);
    downloadCSV("teams_data.csv", csvContent);
}

function convertToCSV(data) {
    // CSV header
    let csvContent = "Team,Average Wins,SOS,Rank\n";

    // Add each row of data
    data.forEach((row) => {
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
