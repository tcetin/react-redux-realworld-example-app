import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import { SET_PAGE, TRACKER_EVENT_TRIGGERED } from '../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onSetPage: (page, payload) =>
    dispatch({ type: SET_PAGE, page, payload }),
  triggerEvent: event => dispatch({
    type: TRACKER_EVENT_TRIGGERED,
    payload: {
      event,
      $currentUrl: window.location.href,
      distinctId: new Date().getTime(),
    }
  })
});

const ListPagination = props => {
  if (props.articlesCount <= 10) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(props.articlesCount / 10); ++i) {
    range.push(i);
  }

  const setPage = page => {
    if (props.pager) {
      props.onSetPage(page, props.pager(page));
    } else {
      props.onSetPage(page, agent.Articles.all(page))
    }
  };

  return (
    <nav>
      <ul className="pagination">

        {
          range.map(v => {
            const isCurrent = v === props.currentPage;
            const onClick = ev => {
              ev.preventDefault();
              props.triggerEvent(`list - click ${v} pagination`);
              setPage(v);
            };
            return (
              <li
                className={isCurrent ? 'page-item active' : 'page-item'}
                onClick={onClick}
                key={v.toString()}>

                <a className="page-link" href="">{v + 1}</a>

              </li>
            );
          })
        }

      </ul>
    </nav>
  );
};

export default connect(() => ({}), mapDispatchToProps)(ListPagination);
