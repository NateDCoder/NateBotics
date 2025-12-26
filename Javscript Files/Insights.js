function addInsightDataToTable(data, totalAmountOfTeams, year) {
    const tableBody = document.querySelector("#insights-table tbody");

    // Clear existing rows (if any)
    tableBody.innerHTML = "";
    console.log(totalAmountOfTeams);
    // Loop through the data and create rows
    for (let team of data) {
        const row = document.createElement("tr");

        // Create cells for each data point
        Object.values(team).forEach((value, index) => {
            if (index < 9) {
                const cell = document.createElement("td");

                // Check if this is the second row
                if (index === 1) {  // 0-based index, so 1 is the second row
                    const link = document.createElement("a");
                    link.href = "./team.html?year=" + year + "&team=" + team["number"];  // Set the desired link
                    link.textContent = value;  // Add the value as the link text
                    cell.appendChild(link);
                } else if (3 <= index && index <= 6) {
                    const div = document.createElement("div");
                    let rank;
                    switch (index) {
                        case 3:
                            rank = "EPA Rank"
                            break;
                        case 4:
                            rank = "Auto EPA Rank"
                            break;
                        case 5:
                            rank = "TeleOp EPA Rank"
                            break;
                        case 6:
                            rank = "Endgame EPA Rank"
                            break;
                    }
                    console.log(team[rank], totalAmountOfTeams);
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
function noMatchesInsightData(eventInfo) {
    var teamData = [];
    let i = 1;
    for (let team of eventInfo.preEloTeamList) {
        teamData.push({
            "number": team["teamNumber"],
            "name": team["teamName"],
            "Estimate Rank":i,
            "epa": Math.round(team["EPA"] * 10) / 10,
            "autoEPA": Math.round(team["Auto EPA"] * 10) / 10,
            "teleopEPA": Math.round(team["TeleOp EPA"] * 10) / 10,
            "endgameEPA": Math.round(team["Endgame EPA"] * 10) / 10,
            "nextEvent": "N/A",
            "record": "N/A",
            "Auto EPA Rank": team["Auto EPA Rank"],
            "TeleOp EPA Rank": team["TeleOp EPA Rank"],
            "Endgame EPA Rank": team["Endgame EPA Rank"],
            "EPA Rank": team["EPA Rank"]
        })
        i++;
    }
    return teamData
}
function matchesInsightData(eventInfo) {
    var teamData = [];
    let i = 1;
    for (let team of eventInfo.afterEloTeamList) {
        console.log(team);
        teamData.push({
            "number": team["teamNumber"],
            "name": team["teamName"],
            "Rank": team["EPA Rank"] ? team["EPA Rank"] : "N/A",
            "epa": Math.round(team["totalEPA"] * 10) / 10,
            "autoEPA": Math.round(team["autonEPA"] * 10) / 10,
            "teleopEPA": Math.round((team["totalEPA"] - team["autonEPA"] - team["endgameEPA"]) * 10) / 10,
            "endgameEPA": Math.round(team["endgameEPA"] * 10) / 10,
            "nextEvent": team["Number"]=="10735"?"Worlds":"N/A",
            "record": "N/A",
            "Auto EPA Rank": team["Auto EPA Rank"]? team["Auto EPA Rank"] : "N/A",
            "TeleOp EPA Rank": team["TeleOp EPA Rank"] ? team["TeleOp EPA Rank"] : "N/A",
            "Endgame EPA Rank": team["Endgame EPA Rank"] ? team["Endgame EPA Rank"] : "N/A",
            "EPA Rank": team["EPA Rank"] ? team["EPA Rank"] : "N/A"
        })
        i++;
    }
    return teamData;
}

async function populateInsightTable(year, eventCode) {
    var eventInfo = await fetchEventDetails(year, eventCode);
    const insightTable = document.getElementById("insights-table");
    if (eventInfo.teams.length == 0) {
        insightTable.innerText = "No Event Info"
    }
    if (!eventInfo.completed) {
        insightTable.innerHTML = `<thead>
            <tr>
                <th onclick="sortTable(0, 'insights-table')">Number</th>
                <th onclick="sortTable(1, 'insights-table')">Name</th>
                <th onclick="sortTable(2, 'insights-table')">EPA Rank</th>
                <th onclick="sortTable(3, 'insights-table')">EPA</th>
                <th onclick="sortTable(4, 'insights-table')">Auto EPA</th>
                <th onclick="sortTable(5, 'insights-table')">Teleop EPA</th>
                <th onclick="sortTable(6, 'insights-table')">Endgame EPA</th>
                <th onclick="sortTable(7, 'insights-table')">Next Event</th>
                <th onclick="sortTable(8, 'insights-table')">Record</th>
            </tr>
        </thead>
        <tbody>
            <!-- Data is dynamically added -->
        </tbody>`
        addInsightDataToTable(noMatchesInsightData(eventInfo), eventInfo.teamsCompeted, year);
        sortTable(3, 'insights-table')
    } else {
        insightTable.innerHTML = `<thead>
            <tr>
                <th onclick="sortTable(0, 'insights-table')">Number</th>
                <th onclick="sortTable(1, 'insights-table')">Name</th>
                <th onclick="sortTable(2, 'insights-table')">Rank</th>
                <th onclick="sortTable(3, 'insights-table')">EPA</th>
                <th onclick="sortTable(4, 'insights-table')">Auto EPA</th>
                <th onclick="sortTable(5, 'insights-table')">Teleop EPA</th>
                <th onclick="sortTable(6, 'insights-table')">Endgame EPA</th>
                <th onclick="sortTable(7, 'insights-table')">Next Event</th>
                <th onclick="sortTable(8, 'insights-table')">Record</th>
            </tr>
        </thead>
        <tbody>
            <!-- Data is dynamically added -->
        </tbody>`
        addInsightDataToTable(matchesInsightData(eventInfo), eventInfo.teamsCompeted, year);
        sortTable(3, 'insights-table');
    }

}

