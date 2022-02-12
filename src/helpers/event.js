import { browserName, browserVersion, osName } from 'react-device-detect';

function getProperties() {
    return {
        $browser: browserName,
        $browser_version: browserVersion,
        $device_id: window.localStorage.getItem('$device_id'),
        $os: osName,
        $screen_height: window.innerHeight,
        $screen_width: window.innerWidth
    }
}

export const trackerEvent = {
    getProperties
}