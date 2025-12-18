document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("year") && params.has("event")) {
        var year = params.get("year");
        var eventCode = params.get("event");
    } else {
        var year = 2025; // Default year
        params.set("year", year);
        var eventCode = "USMISCM1"; // Default event code
        params.set("event", eventCode);
        window.history.replaceState({}, "", `${location.pathname}?${params}`);
    }
    var eventInfo = await fetchEventDetails(year, eventCode);
    document.getElementById("event-name").innerText = eventInfo.name;
    await populateQualMatches(year, eventCode);
    await populateInsightTable(year, eventCode);
    // populateSOS();
});
