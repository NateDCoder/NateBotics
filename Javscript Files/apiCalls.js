// const serverURL = "https://colorful-squid-natebotics-856a73dd.koyeb.app";
const serverURL = "https://nasty-zoe-natebotics-7b2ede31.koyeb.app";
async function getYears() {
    try {
        const response = await fetch(
            `${serverURL}/api/Year_List`
        );
        const years = await response.json();
        return years;
    } catch (error) {
        console.error("Unable to fetch year data:", error);
        return [];
    }
}
async function fetchEvents(year) {
    const response = await fetch(`${serverURL}/api/${year}/Event_List`);
    const data = await response.json();
    return data;
}

async function fetchEventDetails(year, eventCode) {
    const response = await fetch(`${serverURL}/api/${year}/${eventCode}`);
    const data = await response.json();
    return data;
}

async function fetchQualMatches(year, eventCode) {
    const response = await fetch(`${serverURL}/api/${year}/${eventCode}/quals`);
    const data = await response.json();
    return data;
}

async function fetchTeamList(year) {
    const response = await fetch(
        `${serverURL}/api/${year}/Team_List`
    );
    const data = await response.json();
    return data;
}
async function getTeamCount(year) {
    const response = await fetch(
        `${serverURL}/api/${year}/Total_Teams_Count`
    );
    const teamCount = await response.json();
    return teamCount;
}

async function fetchYearList() {
    const response = await fetch(`${serverURL}/api/Year_List`);
    const data = await response.json();
    return data;
}

async function fetchTeamDetails(year, teamNumber) {
    console.log(year, teamNumber);
    const response = await fetch(
        `${serverURL}/api/${year}/team/${teamNumber}`
    );
    const data = await response.json();
    return data;
}