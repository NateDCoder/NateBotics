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
                    link.href = "./team htmls/" + value + ".html";  // Set the desired link
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

                    if (percentile < .25) {
                        div.className = "red-style"
                    } else if (percentile < .75) {
                        div.className = "white-style"
                    } else if (percentile < .9) {
                        div.className = "light-green-style"
                    } else if (percentile < .99) {
                        div.className = "dark-green-style"
                    } else {
                        div.className = "blue-style"

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

function calculateStandardDeviation(numbers) {
    if (numbers.length === 0) return 0; // Handle empty array
    
    // Step 1: Calculate the mean
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;

    // Step 2: Calculate squared differences from the mean
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));

    // Step 3: Find the mean of the squared differences
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;

    // Step 4: Take the square root of the variance
    return Math.sqrt(variance);
}