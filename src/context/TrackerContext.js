import React, { useState } from "react";

const TrackerContext = React.createContext()

export const TrackerProvider = ({ children }) => {
    const [config, setConfig] = useState({});
    const [user, setUser] = useState("");
    const [events, setEvents] = useState([]);

    const init = (config) => { setConfig(config) }
    const identify = (user) => { setUser(user) }
    const track = (_event) => { setEvents(prevState => ([...prevState, _event])) }

    return <TrackerContext.Provider value={{ config, init, user, identify, events, track }}>
        {children}
    </TrackerContext.Provider>
}

export default TrackerContext
