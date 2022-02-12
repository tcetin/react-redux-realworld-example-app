import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutView = ({ LinkClick = () => { }, ...props }) => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item" onClick={() => LinkClick("Home")}>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item" onClick={() => LinkClick("Sign in")}>
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </li>

        <li className="nav-item" onClick={() => LinkClick("Sign up")}>
          <Link to="/register" className="nav-link">
            Sign up
          </Link>
        </li>

      </ul>
    );
  }
  return null;
};

const LoggedInView = ({ LinkClick = () => { }, ...props }) => {
  if (props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item" onClick={() => LinkClick("Home")}>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item" onClick={() => LinkClick("New Post")}>
          <Link to="/editor" className="nav-link">
            <i className="ion-compose"></i>&nbsp;New Post
          </Link>
        </li>

        <li className="nav-item" onClick={() => LinkClick("Settings")}>
          <Link to="/settings" className="nav-link" >
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Link>
        </li>

        <li className="nav-item" onClick={() => LinkClick("Username")}>
          <Link
            to={`/@${props.currentUser.username}`}
            className="nav-link">
            <img src={props.currentUser.image} className="user-pic" alt={props.currentUser.username} />
            {props.currentUser.username}
          </Link>
        </li>

      </ul>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <Link to="/" className="navbar-brand" onClick={() => this.props.HeaderClick("AppName")}>
            {this.props.appName.toLowerCase()}
          </Link>

          <LoggedOutView currentUser={this.props.currentUser} LinkClick={this.props.HeaderClick} />

          <LoggedInView currentUser={this.props.currentUser} LinkClick={this.props.HeaderClick} />
        </div>
      </nav>
    );
  }
}

export default Header;
