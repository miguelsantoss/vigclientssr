import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import _map from 'lodash/map';
import { Menu } from 'semantic-ui-react';

import Link from '../Link';
import s from './Sidebar.css';

class Sidebar extends React.Component {
  static propTypes = {
    audits: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      history: null,
    };
  }

  renderAudits() {
    const { audits } = this.props;
    // Sort audits by data iniciated
    // FIXME: use closed_at date in the sort too - deal with NULL
    // const auditsByDate = audits.sort((a, b) =>
    //   moment(b.initiated_at, 'YYYY-MM-DD') - moment(a.initiated_at, 'YYYY-MM-DD'),
    // );
    // Map each audit into a Menu item element
    const auditsRender = _map(audits, audit =>
      <Menu.Item key={audit.serial_number} as={Link} to={`/audit/${audit.id}`}>
        {`${moment(audit.created_at).format('DD MMM YYYY')}${audit.closed_at ===
        ''
          ? ' (Open)'
          : ''}`}
      </Menu.Item>,
    );
    return auditsRender;
  }

  render() {
    return (
      <Menu vertical fixed="left" inverted className={s.sidebar}>
        <Menu.Item>
          <Menu.Header as={Link} to="/profile">
            Client Profile
          </Menu.Header>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header as={Link} to="/audits">
            Audits
          </Menu.Header>
          <Menu.Menu>
            {this.renderAudits()}
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withStyles(s)(Sidebar);
