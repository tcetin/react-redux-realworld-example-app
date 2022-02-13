
export const trackerService = {
    saveTrackerEvents
}

function saveTrackerEvents(events, api_host) {
    const eventsStr = JSON.stringify({ events });
    const eventsStrBase64 = Buffer.from(eventsStr).toString("base64");
    return fetch(api_host, {
        method: 'POST',
        body: eventsStrBase64
    });
}