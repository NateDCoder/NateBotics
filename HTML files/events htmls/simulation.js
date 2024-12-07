const labels = [
    "Before Schedule Release",
    "Schedule Release",
    "After Schedule Release",
    "Qual Match 1",
    "Qual Match 2",
    "Qual Match 3"
];

const slider = document.getElementById("slider");
const sliderLabel = document.getElementById("slider-label");
// Update label based on slider value
slider.addEventListener("input", () => {
    const value = slider.value;
    sliderLabel.innerHTML = `Simulate from: <strong>${labels[value]}</strong>`;
});

async function fetchAndPopulateSimulation() {
    let eventInfo = await getEventInfo();
    let schedule = eventInfo.schedule;

    populateSimulation(getSimulationData(eventInfo))
}

function getSimulationData(eventInfo) {
    var teamData = [];
    let i = 1;
    for (let team of eventInfo.preEloTeamList) {
        teamData.push({
            "Predicted Rank": i,
            "name": team["Name"],
            "EPA Rank":team["EPA Rank"],
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

function populateSimulation(data) {
    const tableBody = document.querySelector("#simulation-table tbody");

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