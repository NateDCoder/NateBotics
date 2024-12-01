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

async function fetchTeamList() {
    const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/Team_List');
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
    let teamListData = await fetchTeamList()
    var teamData = [];
    console.log(teamListData)
    for (let team of teamListData) {
        teamData.push({
            "number": team["Number"],
            "name": team["Name"],
            "EPA Rank": team["EPA Rank"],
            "unitlessEPA": Math.round(team["Unitless EPA"]),
            "epa": Math.round(team["EPA"] * 10) / 10,
            "autoEPA": Math.round(team["Auto EPA"] * 10) / 10,
            "teleopEPA": Math.round(team["TeleOp EPA"] * 10) / 10,
            "endgameEPA": Math.round(team["Endgame EPA"] * 10) / 10,
            "nextEvent": "N/A",
            "record": "N/A",
            "Auto EPA Rank": team["Auto EPA Rank"],
            "TeleOp EPA Rank": team["TeleOp EPA Rank"],
            "Endgame EPA Rank": team["Endgame EPA Rank"]
        })
    }

    return teamData
}

// Function to populate the table
function populateTable(data) {
    const tableBody = document.querySelector("#sortable-table tbody");

    // Clear existing rows (if any)
    tableBody.innerHTML = "";
    const totalAmountOfTeams = 533
    // Loop through the data and create rows
    for (let team of data) {
        const row = document.createElement("tr");

        // Create cells for each data point
        Object.values(team).forEach((value, index) => {
            if (index < 10) {
                const cell = document.createElement("td");

                // Check if this is the second row
                if (index === 1) {  // 0-based index, so 1 is the second row
                    const link = document.createElement("a");
                    link.href = "./team htmls/" + value + ".html";  // Set the desired link
                    link.textContent = value;  // Add the value as the link text
                    cell.appendChild(link);
                } else if (4 <= index && index <= 7) {
                    const div = document.createElement("div");  
                    let rank;
                    switch (index) {
                        case 4:
                            rank = "EPA Rank"
                            break;
                        case 5:
                            rank = "Auto EPA Rank"
                            break;
                        case 6:
                            rank = "TeleOp EPA Rank"
                            break;
                        case 7:
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