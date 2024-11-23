var week1STD = 20.730805684966178;
async function generateRankings() {
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
    leagueTeams.forEach(team => {
        eloRatings[team] = 1500; // Assign random Elo values
    });
    var matchInfo = await fetchData1();
    for (let i = 0; i < 2; i++) {
        var multipier = 1
        for (let i = 0; i < matchInfo.length; i++) {
            if (i >= 125) {
                multipier = 1.5
            }
            console.log(matchInfo.length)
            var match = matchInfo[i]
            var redTeam = match.redTeams;
            var blueTeam = match.blueTeams;

            var redScore = match.redScore;
            var blueScore = match.blueScore;
            var redElo = eloRatings[redTeam[0]] + eloRatings[redTeam[1]]
            var blueElo = eloRatings[blueTeam[0]] + eloRatings[blueTeam[1]]

            var predictedScoreMargin = 0.004 * (redElo - blueElo);
            var actualScoreMargin = (redScore - blueScore) / week1STD;
            var eloDelta = multipier * 12 * (actualScoreMargin - predictedScoreMargin)

            eloRatings[redTeam[0]] += eloDelta;
            eloRatings[redTeam[1]] += eloDelta;

            eloRatings[blueTeam[0]] -= eloDelta;
            eloRatings[blueTeam[1]] -= eloDelta;

        }
    }
    // for (let i = 0; i < sortedTeams.length; i++) {
    //     process.stdout.write(sortedTeams[i][1] + ",")
    // }
    return eloRatings;
}
async function fetchData1() {
    const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/data1');
    const data = await response.json();
    return data;
}
async function fetchData2() {
    const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/data2');
    const data = await response.json();
    return data;
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
async function fetchData1() {
    const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/data1');
    const data = await response.json();
    return data;
}
async function populateTable(data) {
    const tableBody = document.querySelector("#sortable-table tbody");

    // Clear existing rows (if any)
    tableBody.innerHTML = "";
    var teamToElo = data;
    var schedule = (await fetchJSONData("../data/event_schedule.json")).schedule;
    var matches = await fetchData1();
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
        var redTeamElo = teamToElo[red1] + teamToElo[red2];
        var blueTeamElo = teamToElo[blue1] + teamToElo[blue2];
        var actualDifference = 0;
        if (matches[125+i]) {
            actualDifference = matches[125+i].redScore - matches[125+i].blueScore; 
        }
        matchData.push({
            "Match Number": "Qual " + (i + 1),
            "Red1": red1,
            "Red2": red2,
            "Blue1": blue1,
            "Blue2": blue2,
            "score diff": 2 * parseInt(20.730805684966178 * 0.004 * (redTeamElo - blueTeamElo)),
            "actual score diff": actualDifference,
            "win percentage": parseInt(100 / (1 + Math.pow(10, Math.min((redTeamElo - blueTeamElo), (blueTeamElo - redTeamElo)) / 400))) + "%"
        })
    }
    // Loop through the data and create rows
    matchData.forEach(match => {
        const row = document.createElement("tr");

        // Create cells for each data point with specific styles
        Object.values(match).forEach((value, index) => {
            const cell = document.createElement("td");

            // Apply style based on index or value for the specific cells
            if (index === 1 || index === 2) {
                // Apply style for the second and third cells (e.g., 4338, 4320)
                cell.style.backgroundColor = "rgb(255, 238, 238)";
                cell.style.color = "rgb(29 78 216)";
            } else if (index === 3 || index === 4) {
                // Apply style for the fourth and fifth cells (e.g., 4319, 1690)
                cell.style.backgroundColor = "rgb(238, 238, 255)";
                cell.style.color = "rgb(29 78 216)";
            } else if (index === 5) {
                if (value < 0) {
                    cell.style.backgroundColor = "rgb(238, 238, 255)";
                    cell.style.color = "rgb(29 78 216)";
                } else {
                    cell.style.backgroundColor = "rgb(255, 238, 238)";
                    cell.style.color = "rgb(29 78 216)";
                }
            } else if (index === 6) {
                if (value < 0) {
                    cell.style.backgroundColor = "rgb(238, 238, 255)";
                    cell.style.color = "rgb(29 78 216)";
                } else {
                    cell.style.backgroundColor = "rgb(255, 238, 238)";
                    cell.style.color = "rgb(29 78 216)";
                }
            }

            // Set the text content of the cell
            cell.textContent = value;

            // Append the cell to the row
            row.appendChild(cell);
        });

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}
async function fetchAndPopulateTable() {

    try {
        const data = await generateRankings(); // Parse JSON
        populateTable(data); // Populate the table
    } catch (error) {
        console.error("Error fetching the JSON data:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fetchAndPopulateTable();
});