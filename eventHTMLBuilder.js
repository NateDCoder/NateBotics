import { writeFile, appendFile, readFile } from 'fs/promises';
const eventNames = await fetchEventNames();
Object.entries(eventNames).forEach(([code, name]) => {
    let path = "./HTML files/events htmls/" + code + ".html"

    let htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="../../Statbotics_files/not_statbotic.ico">
    <title>Totally Not Statbotics</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .header {
            background-color: #333;
            color: #fff;
            display: flex;
            justify-content: space-between;
            padding: 10px 20px;
            align-items: center;
        }

        .nav-container {
            display: flex;
            align-items: center;
        }

        .nav-container img {
            width: 32px;
            /* Adjust size as needed */
            height: 32px;
            margin-right: 10px;
            /* Spacing between image and links */
        }

        .header a {
            color: #fff;
            text-decoration: none;
            margin: 0 10px;
        }

        .header a:hover {
            text-decoration: underline;
        }

        .buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        .buttons a {
            text-decoration: none;
            padding: 10px 20px;
            background-color: #333;
            color: #fff;
            border-radius: 5px;
            font-size: 1em;
        }

        .buttons a:hover {
            background-color: #555;
        }

        .main-content {
            text-align: center;
            padding: 50px 20px;
        }

        /* Styling the tabs container */
        .tabs {
            display: flex;
            border-bottom: 2px solid #ccc;
            margin-bottom: 20px;
        }

        /* Styling individual tabs */
        .tab {
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            color: blue;
            border: none;
            background: none;
            font-size: 16px;
            cursor: pointer;
        }

        /* Active tab style */
        .tab.active {
            color: black;
            border-bottom: 2px solid black;
        }

        /* Tab content styles */
        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .table-container {
            width: 80%;
            /* Container spans full width */
            margin: 0 auto;
            /* Center the container */
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        table thead {
            position: sticky;
            top: 0;
            background-color: #f4f4f4;
            z-index: 1;
            /* Ensure it stays above the table rows */
        }

        th,
        td {
            padding: 10px;
            text-align: center;
        }

        th {
            cursor: pointer;
            border-bottom: 3px solid black;
        }

        th:hover {
            background-color: #ddd;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:nth-child(odd) {
            background-color: #fff;
        }

        table a:link,
        table a:visited {
            color: blue;
        }

        .table-title {
            font-size: large;
            text-align: left;
            margin-bottom: 3%;
            margin-left: 2%;
        }

        .red-style {
            margin: 0 auto;
            color: rgb(185, 28, 28);
            padding: 0.3rem;
            width: 3rem;
            background-color: rgb(254, 226, 226);
            border-radius: 0.5rem;
            text-align: center;

        }

        .light-green-style {
            margin: 0 auto;
            color: rgb(22 101 52);
            padding: 0.3rem;
            width: 3rem;
            background-color: rgb(240 253 244);
            border-radius: 0.5rem;
            text-align: center;
        }

        .dark-green-style {
            margin: 0 auto;
            color: rgb(22 101 52);
            padding: 0.3rem;
            width: 3rem;
            background-color: rgb(220 252 231);
            border-radius: 0.5rem;
            text-align: center;
        }

        .blue-style {
            margin: 0 auto;
            color: rgb(30 64 175);
            padding: 0.3rem;
            width: 3rem;
            background-color: rgb(191 219 254);
            border-radius: 0.5rem;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="nav-container">
            <!-- Image next to links -->
            <a href="../../index.html">
                <img src="../../Statbotics_files/not_statbotic.ico" alt="Logo">
            </a>
            <div class="nav-links">
                <a href="../teams.html">Teams</a>
                <a href="../events.html">Events</a>
                <a href="#">Matches</a>
                <a href="#">Misc</a>
            </div>
        </div>
        <div class="search">
            <input type="text" placeholder="Search Teams and Events" style="padding: 5px;">
        </div>
    </div>
    <div class="main-content">
        <h1>${name}</h1>
        <div class="tabs">
            <button class="tab active" onclick="showTab('insights')">Insights</button>
            <button class="tab" onclick="showTab('qual-matches')">Qual Matches</button>
            <button class="tab" onclick="showTab('alliances')">Alliances</button>
            <button class="tab" onclick="showTab('elim-matches')">Elim Matches</button>
            <button class="tab" onclick="showTab('simulation')">Simulation</button>
            <button class="tab" onclick="showTab('sos')">SOS</button>
        </div>

        <div id="insights" class="tab-content active">
            <div class="table-container">
                <div class="table-title">Team Insights</div>
                <table id="insights-table">
                    <!--Data is Load Dynamically-->
                </table>
            </div>
        </div>
        <div id="qual-matches" class="tab-content">Content for Qual Matches</div>
        <div id="alliances" class="tab-content">Content for Alliances</div>
        <div id="elim-matches" class="tab-content">Content for Elim Matches</div>
        <div id="simulation" class="tab-content">Content for Simulation</div>
        <div id="sos" class="tab-content">Content for SOS</div>

        <script>
            function showTab(tabId) {
                // Remove the active class from all tabs
                const tabs = document.querySelectorAll('.tab');
                tabs.forEach(tab => tab.classList.remove('active'));

                // Hide all tab contents
                const contents = document.querySelectorAll('.tab-content');
                contents.forEach(content => content.classList.remove('active'));

                // Activate the clicked tab and show its content
                document.querySelector(\`[onclick="showTab('\${tabId}')"]\`).classList.add('active');
                document.getElementById(tabId).classList.add('active');
            }
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
                for (let team of eventInfo.preEloTeamList) {
                    teamData.push({
                        "number": team["Number"],
                        "name": team["Name"],
                        "EPA Rank": team["EPA Rank"],
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
                console.log(eventInfo)
                if (!eventInfo["hasTeamList"]) {
                    insightTable.innerText = "No Event Info"
                }
                if (!eventInfo["hasScheduleist"]) {
                    \`<thead>
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
                    </tbody>\`
                    addInsightDataToTable(noMatchesInsightData(eventInfo));
                } else {
                    insightTable.innerHTML = \`<thead>
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
                    </tbody>\`
                    addInsightDataToTable(matchesInsightData(eventInfo));
                }

            }
            document.addEventListener("DOMContentLoaded", () => {
                populateInsightTable();
            });
            async function getEventInfo() {
                const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/${code}');
                const data = await response.json();
                return data;
            }
            function sortTable(columnIndex, id) {
                const table = document.getElementById(id);
                const tbody = table.querySelector("tbody");
                const rows = Array.from(tbody.querySelectorAll("tr"));

                const isNumeric = !isNaN(rows[0].children[columnIndex].innerText);

                rows.sort((rowB, rowA) => {
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
        </script>
    </div>
</body>

</html>`
    writeFile(path, htmlContent);
});
async function fetchEventNames() {
    const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/Event_Names');
    const data = await response.json();
    return data;
}