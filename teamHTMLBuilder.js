import { writeFile, appendFile, readFile } from 'fs/promises';
const teamList = await fetchTeamList();
for (let team of teamList) {
    let path = "./HTML files/team htmls/" + team["Number"] + ".html"

    let htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EPA Over Time</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <h1>EPA Over Time</h1>
    <canvas id="epaChart" width="800" height="400"></canvas>

    <script>
        async function generateGraph(params) {
            const ctx = document.getElementById('epaChart').getContext('2d');
            var teamNumber = ${team["Number"]};
            var eloOverTime = await getNameToEloOverTime();
            var teamData = eloOverTime[teamNumber];
            const labels = Array.from({ length: teamData.length }, (_, i) => i);
            const epaData = {
                labels: labels,
                datasets: [{
                    label: 'EPA',
                    data: teamData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.1,
                    pointRadius: 4,
                }]
            };

            const config = {
                type: 'line',
                data: epaData,
                options: {
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Match'
                            }
                        },
                        y: {
                            min: Math.min(0, Math.min(teamData)),
                            title: {
                                display: true,
                                text: 'Total EPA'
                            }
                        }
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'xy',
                        intersect: false, // Ensures the tooltip appears even when not intersecting a point
                    },
                },
            };
            const epaChart = new Chart(ctx, config);
        }

        async function fetchTeamList() {
            const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/Team_List');
            const data = await response.json();
            return data;
        }
        async function getNameToEloOverTime() {
            let teamList = await fetchTeamList();
            let nameToEloOverTime = {}
            for (let team of teamList) {
                nameToEloOverTime[team["Number"]] = team["EPA Over Time"]
            }
            return nameToEloOverTime;
        }
        document.addEventListener("DOMContentLoaded", () => {
            generateGraph();
        });
    </script>
</body>

</html>`
    writeFile(path, htmlContent);
}
async function fetchTeamList() {
    const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/Team_List');
    const data = await response.json();
    return data;
}