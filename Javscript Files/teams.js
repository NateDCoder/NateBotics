function sortTable(columnIndex) {
    const table = document.getElementById("sortable-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const isNumeric = !isNaN(rows[0].children[columnIndex].innerText);

    rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].innerText;
        const cellB = rowB.children[columnIndex].innerText;

        if (isNumeric) {
            return parseFloat(cellA) - parseFloat(cellB);
        } else {
            return cellA.localeCompare(cellB);
        }
    });

    // Reversing rows if already sorted in ascending order
    const sortedAsc = tbody.getAttribute("data-sorted") == columnIndex;
    if (sortedAsc) rows.reverse();

    // Update sorted attribute
    tbody.setAttribute("data-sorted", sortedAsc ? "" : columnIndex);

    // Append sorted rows
    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
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
    var week1STD = 20.730805684966178;
    var matchInfo = await fetchData1();
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
    const sortedTeams = Object.entries(eloRatings)
        .filter(([key, value]) => !isNaN(value)) // Remove NaN values
        .sort((a, b) => b[1] - a[1]); // Sort by value in ascending order

    var numberToName = await fetchJSONData("../data/Number to Name.json");
    // for (let i = 0; i < sortedTeams.length; i++) {
    //     process.stdout.write(sortedTeams[i][1] + ",")
    // }
    var teamData = [];
    for (let i = 0; i < sortedTeams.length; i++) {
        teamData.push({
            "number": sortedTeams[i][0],
            "name": numberToName[sortedTeams[i][0]],
            "epaRank": (i + 1),
            "unitlessEPA": Math.floor(sortedTeams[i][1]),
            "epa": "N/A",
            "autoEPA": "N/A",
            "teleopEPA": "N/A",
            "endgameEPA": "N/A",
            "nextEvent": "N/A",
            "record": "N/A"
        })
    }
    return teamData
}

// Function to populate the table
function populateTable(data) {
    const tableBody = document.querySelector("#sortable-table tbody");

    // Clear existing rows (if any)
    tableBody.innerHTML = "";

    // Loop through the data and create rows
    data.forEach(team => {
        const row = document.createElement("tr");

        // Create cells for each data point
        Object.values(team).forEach((value, index) => {
            const cell = document.createElement("td");
        
            // Check if this is the second row
            if (index === 1) {  // 0-based index, so 1 is the second row
                const link = document.createElement("a");
                link.href = "./team htmls/"+value+".html";  // Set the desired link
                link.textContent = value;  // Add the value as the link text
                cell.appendChild(link);
            } else {
                cell.textContent = value;  // For other rows, just set text content
            }
        
            row.appendChild(cell);
        });

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Fetch JSON data and populate the table
async function fetchAndPopulateTable() {
    try {
        const data = await generateRankings(); // Parse JSON
        console.log(data)
        populateTable(data); // Populate the table
    } catch (error) {
        console.error("Error fetching the JSON data:", error);
    }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchAndPopulateTable();
});