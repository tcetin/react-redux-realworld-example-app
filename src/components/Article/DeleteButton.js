import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { DELETE_COMMENT, TRACKER_EVENT_TRIGGERED } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload, commentId) =>
    dispatch({ type: DELETE_COMMENT, payload, commentId }),
  triggerEvent: event => dispatch({
    type: TRACKER_EVENT_TRIGGERED,
    payload: {
      event,
      $currentUrl: window.location.href,
      distinctId: new Date().getTime(),
    }
  })
});

const DeleteButton = props => {
  const del = () => {
    props.triggerEvent("comment - click delete comment button");
    const payload = agent.Comments.delete(props.slug, props.commentId);
    props.onClick(payload, props.commentId);
  };

  if (props.show) {
    return (
      <span className="mod-options">
        <i className="ion-trash-a" onClick={del}></i>
      </span>
    );
  }
  return null;
};

export default connect(() => ({}), mapDispatchToProps)(DeleteButton);
