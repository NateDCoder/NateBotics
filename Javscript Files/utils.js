// const serverURL = "https://international-ashly-waffles-bedc2f70.koyeb.app";
const serverURL = "http://localhost:3000";
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
