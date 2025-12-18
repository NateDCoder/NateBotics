async function generateEvents(year) {
    const events = await fetchEvents(year);
    const eventContainer = document.getElementsByClassName("events-container")[0];
    /*
        Events have the following properties:
        code:
        dateStart:
        eventName:
    */
    document.getElementById("total-events").innerText = `Total Events (${events.length})`;
    for (let event of events) {
        const link = document.createElement("a");
        link.href = "../HTML files/event.html?year=" + year + "&event=" + event.code;
        const div = document.createElement("div");
        div.className = "event-card";
        const h3 = document.createElement("h3");
        h3.innerText = event.eventName;
        console.log(event);
        div.append(h3);
        link.append(div);
        eventContainer.append(link);
    }
    
}


document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    var year;
    if (params.has("year")) {
        year = params.get("year");
    } else {
        let years = await getYears();
        if (years.length > 0) {
            year = years[0];
            params.set("year", year);
            window.history.replaceState({}, "", `${location.pathname}?${params}`);
        } else {
            console.error("No years available to select.");
            return;
        }
    }
    generateEvents(year);
});
