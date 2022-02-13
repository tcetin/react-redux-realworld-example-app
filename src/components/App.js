import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT, TRACKER_EVENT_TRIGGERED } from '../constants/actionTypes';
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


const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
    ...state.tracker,
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
  })
});

class App extends React.Component {
  static contextType = TrackerContext;

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


  render() {
    if (this.props.appLoaded) {
      const { people } = this.context;
      people.set({ "Plan": "Premium" });
      return (
        <div>
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser}
            HeaderClick={(link) => {
              //this.props.triggerEvent(`header - click ${link}`);
            }} />
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
