function sortTable(columnIndex) {
    const table = document.getElementById("sortable-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    function parseRecord(str) {
        const parts = str.split("-").map(Number);
        return parts.length === 3 ? parts : null;
    }

    const firstCell = rows[0].children[columnIndex].innerText.trim();
    const isRecord = /^\d+-\d+-\d+$/.test(firstCell);
    const isNumeric = !isNaN(firstCell) && !isRecord;

    rows.sort((rowB, rowA) => {
        const cellA = rowA.children[columnIndex].innerText.trim();
        const cellB = rowB.children[columnIndex].innerText.trim();

        if (isRecord) {
            const [winsA, lossesA, drawsA] = parseRecord(cellA);
            const [winsB, lossesB, drawsB] = parseRecord(cellB);

            // Sort by wins descending, then losses ascending, then draws descending
            if (winsA !== winsB) return winsA - winsB;
            if (lossesA !== lossesB) return lossesB - lossesA;
            return drawsB - drawsA;
        } else if (isNumeric) {
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
    rows.forEach((row) => tbody.appendChild(row));
}

async function populateYears() {
    try {
        const years = await fetchYearList();
        for (let year of years) {
            const option = document.createElement("option");
            option.value = year;
            option.text = year;

            document.getElementById("years").appendChild(option);
        }
    } catch (error) {
        console.error("Unable to fetch year data:", error);
    }
}

async function generateRankings(year) {
    console.log(year)
    let teamListData = await fetchTeamList(year);
    var teamData = [];
    for (let team of teamListData) {
        teamData.push({
            teamNumber: team["teamNumber"],
            name: team["teamName"],
            "EPA Rank": team["EPA Rank"],
            unitlessEPA: Math.round(team["unitlessEPA"]),
            epa: Math.round(team["totalEPA"] * 10) / 10,
            autoEPA: Math.round(team["autonEPA"] * 10) / 10,
            teleopEPA: Math.round(team["teleOpEPA"] * 10) / 10,
            endgameEPA: Math.round(team["endgameEPA"] * 10) / 10,
            nextEvent: "N/A",
            record: `${team["wins"]}-${team["loss"]}-${team["ties"]}`,
            "Auto EPA Rank": team["Auto EPA Rank"],
            "TeleOp EPA Rank": team["TeleOp EPA Rank"],
            "Endgame EPA Rank": team["Endgame EPA Rank"],
        });
    }

    return teamData;
}

// Function to populate the table
async function populateTable(data, year) {
    const tableBody = document.querySelector("#sortable-table tbody");

    // Clear existing rows (if any)
    tableBody.innerHTML = "";
    const totalAmountOfTeams = await getTeamCount(year);
    console.log(totalAmountOfTeams);
    // Loop through the data and create rows
    for (let team of data) {
        const row = document.createElement("tr");

        // Create cells for each data point
        Object.values(team).forEach((value, index) => {
            if (index < 10) {
                const cell = document.createElement("td");

                // Check if this is the second row
                if (index === 1) {
                    // 0-based index, so 1 is the second row
                    const link = document.createElement("a");
                    link.href = "./team.html?year=" + year + "&team=" + team["teamNumber"]; // Set the desired link
                    link.textContent = value; // Add the value as the link text
                    cell.appendChild(link);
                } else if (4 <= index && index <= 7) {
                    const div = document.createElement("div");
                    let rank;
                    switch (index) {
                        case 4:
                            rank = "EPA Rank";
                            break;
                        case 5:
                            rank = "Auto EPA Rank";
                            break;
                        case 6:
                            rank = "TeleOp EPA Rank";
                            break;
                        case 7:
                            rank = "Endgame EPA Rank";
                            break;
                    }
                    let percentile = 1 - team[rank] / totalAmountOfTeams;
                    div.className = getColorClassStyle(percentile);
                    div.textContent = value;
                    cell.appendChild(div);
                } else {
                    cell.textContent = value; // For other rows, just set text content
                }
                row.appendChild(cell);
            }
        });

        // Append the row to the table body
        tableBody.appendChild(row);
    }
}

// Fetch JSON data and populate the table
async function fetchAndPopulateTable() {
    try {
        const selectedYear = document.getElementById("years").value;
        const data = await generateRankings(selectedYear);
        await populateTable(data, selectedYear); // Populate the table
    } catch (error) {
        console.error("Error fetching the JSON data:", error);
    }
    
    document.getElementById("sortable-table").querySelector("tbody").setAttribute("data-sorted", "");
    sortTable(4);
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", async () => {
    await populateYears();
    await fetchAndPopulateTable();
    document.getElementById("years").addEventListener("change", async () => {
        await fetchAndPopulateTable();
    });
});
