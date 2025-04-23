async function generateEvents() {
    const eventNames = await fetchEventNames();
    const eventContainer = document.getElementsByClassName("events-container")[0];
    Object.entries(eventNames).forEach(([code, name]) => {
        const link = document.createElement("a")
        link.href = "../HTML files/events htmls/"+code+".html"
        const div = document.createElement("div");
        div.className = "event-card";
        const h3 = document.createElement("h3");
        h3.innerText = name
        div.append(h3)
        link.append(div)
        eventContainer.append(link)
    
    });
}
async function fetchEventNames() {
    const response = await fetch('https://international-ashly-waffles-bedc2f70.koyeb.app/api/Event_Names');
    const data = await response.json();
    return data;
}
document.addEventListener("DOMContentLoaded", () => {
    generateEvents();
});