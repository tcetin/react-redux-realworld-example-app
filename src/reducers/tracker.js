import {
    TRACKER_EVENT_TRIGGERED
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case TRACKER_EVENT_TRIGGERED:
            return {
                ...state,
                trackerEvent: action.payload.event,
                $currentUrl: action.payload.$currentUrl,
                eventDistinctId: action.payload.distinctId
            };
        default:
            return state;
    }
};
