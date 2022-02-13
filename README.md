# Event Tracking

User event tracking implemented to [orijinal react/redux real world application](https://github.com/gothinkster/react-redux-realworld-example-app).

## Project Description

- `TrackerContext` react context is created to catch user events and it is updated in `components/App` component.
- The `tracker` reducer is created to generate tracker global state.
- The `TRACKER_EVENT_TRIGGERED` action is dispatched in all `onClick`,`onSubmit` and `onChange` events.
- The state of tracker events is checked by `eventDistinctId` payload parameter in the `App` component. Every new event is pushed to the `TrackerContext`'s events state by generating new event id.
- The `saveEvents` state is created in the `App` component as a control flag in order to send bulk events to the api. The `saveEvents`'s state is updated by creating time interval in the `App` component.
- `TrackerContext`'s events are cleared after the tracked events are sent to the api.
- `TRACKER_EVENT_SAVE_STARTED` and `TRACKER_EVENT_SAVE_FINISHED` tracker actions are created for observing to the current http save request.
- Every route change is dispatched in the `App` component.
