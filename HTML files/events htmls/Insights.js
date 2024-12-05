function addInsightDataToTable(data) {
    const tableBody = document.querySelector("#insights-table tbody");

    // Clear existing rows (if any)
    tableBody.innerHTML = "";
    const totalAmountOfTeams = 533
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
                    link.href = "../team htmls/" + team["number"] + ".html";  // Set the desired link
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
            "number": team["Number"],
            "name": team["Name"],
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
    for (let team of eventInfo.afterEloTeamList) {
        teamData.push({
            "number": team["Number"],
            "name": team["Name"],
            "Rank": team["Rank"],
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
    }
    return teamData;
}

async function populateInsightTable() {
    var eventInfo = await getEventInfo();
    const insightTable = document.getElementById("insights-table");
    if (!eventInfo["hasTeamList"]) {
        insightTable.innerText = "No Event Info"
    }
    if (!eventInfo["hasScheduleist"]) {
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
        addInsightDataToTable(noMatchesInsightData(eventInfo));
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
        addInsightDataToTable(matchesInsightData(eventInfo));
    }

}

