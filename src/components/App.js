import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT, TRACKER_EVENT_SAVE_FINISHED, TRACKER_EVENT_SAVE_STARTED, TRACKER_EVENT_TRIGGERED } from '../constants/actionTypes';
import { Route, Switch } from 'react-router-dom';
import Article from '../components/Article';
import Editor from '../components/Editor';
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import ProfileFavorites from '../components/ProfileFavorites';
import Register from '../components/Register';
import Settings from '../components/Settings';
import { store } from '../store';
import { push } from 'react-router-redux';
import TrackerContext from '../context/TrackerContext';
import { trackerEvent } from '../helpers';
import { trackerService } from '../services';


const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
    eventDistinctId: state.tracker.eventDistinctId,
    $currentUrl: state.tracker.$currentUrl,
    trackerEvent: state.tracker.trackerEvent,
    token: state.common.token
  }
};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: REDIRECT }),
  triggerEvent: event => dispatch({
    type: TRACKER_EVENT_TRIGGERED,
    payload: {
      event,
      $currentUrl: window.location.href,
      distinctId: new Date().getTime(),
    }
  }),
  trackerEventsSaveStarted: () => dispatch({
    type: TRACKER_EVENT_SAVE_STARTED,
  }),
  trackerEventsSaveFinished: () => dispatch({
    type: TRACKER_EVENT_SAVE_FINISHED
  })
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      saveEvents: false
    }

  }

  static contextType = TrackerContext;

  intervalId = 0;

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(prevState => ({ saveEvents: !prevState.saveEvents }));
    }, 10000);
  }

  componentWillReceiveProps(prevProps, nextProps) {

    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }

    if (nextProps.currentUser) {
      const { identify } = this.context;
      identify(this.props.currentUser.email);
    }


  }

  componentDidUpdate(prevProps) {
    if (prevProps.eventDistinctId !== this.props.eventDistinctId) {
      const { track } = this.context;
      track({
        event: this.props.trackerEvent,
        properties: {
          distinct_id: this.props.eventDistinctId,
          token: this.props.token,
          $currentUrl: this.props.$currentUrl,
          ...trackerEvent.getProperties()
        }
      })
    }
  }

  componentWillMount() {
    const { init } = this.context;
    init({
      api_host: process.env.REACT_APP_API_URL,
    });

    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    this.props.onLoad(token ? agent.Auth.current() : null, token);


  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.saveEvents) {
      const { events, config, clearEvents } = this.context;
      if (events.length) {
        this.props.trackerEventsSaveStarted();
        trackerService.saveTrackerEvents(events, config.api_host)
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              // clear tracker context events
              clearEvents();
              this.props.trackerEventsSaveFinished();
            } else {
              throw new Error("Failed to save tracker events");
            }
          }).catch(err => {
            console.log(err.message)
          });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }



  render() {
    if (this.props.appLoaded) {
      const { people } = this.context;

      people.set({ "Plan": "Premium" });

      return (
        <div>
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/editor/:slug" component={Editor} />
            <Route path="/editor" component={Editor} />
            <Route path="/article/:id" component={Article} />
            <Route path="/settings" component={Settings} />
            <Route path="/@:username/favorites" component={ProfileFavorites} />
            <Route path="/@:username" component={Profile} />
          </Switch>
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser} />
      </div>
    );
  }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);
