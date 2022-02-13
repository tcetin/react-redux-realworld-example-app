import {
    TRACKER_EVENT_SAVE_FINISHED,
    TRACKER_EVENT_SAVE_STARTED,
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
        case TRACKER_EVENT_SAVE_STARTED:
        case TRACKER_EVENT_SAVE_FINISHED:
        default:
            return state;
    }
};
