import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import _map from 'lodash/map';
import { Menu, Icon } from 'semantic-ui-react';

import Link from '../Link';
import s from './Sidebar.css';

class Sidebar extends React.Component {
  static propTypes = {
    audits: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    active: PropTypes.shape({
      route: PropTypes.string.isRequired,
      id: PropTypes.number,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      history: null,
    };
  }

  renderAudits() {
    const { audits } = this.props;
    const { active } = this.props;
    // Sort audits by data iniciated
    // FIXME: use closed_at date in the sort too - deal with NULL
    // const auditsByDate = audits.sort((a, b) =>
    //   moment(b.initiated_at, 'YYYY-MM-DD') - moment(a.initiated_at, 'YYYY-MM-DD'),
    // );
    // Map each audit into a Menu item element
    // const auditsRender = _map(audits, audit =>
    //   <Menu.Item key={audit.serial_number} as={Link} to={`/audit/${audit.id}`}>
    //     {`${moment(audit.created_at).format('DD MMM YYYY')}${audit.closed_at ===
    //     ''
    //       ? ' (Open)'
    //       : ''}`}
    //   </Menu.Item>,
    // );
    // return auditsRender;
    const types = ['Web', 'External', 'Internal'];
    const menuItems = [[], [], []];
    _map(audits, audit => {
      let cat = 0;
      if (audit.category === 'web') {
        cat = 0;
      } else if (audit.category === 'external network') {
        cat = 1;
      } else {
        cat = 2;
      }
      menuItems[cat].push(
        <Menu.Item
          key={audit.serial_number}
          as={Link}
          to={`/audit/${audit.id}`}
          active={active.route === 'audit' && active.id === audit.id}
        >
          {`${moment(audit.created_at).format('DD MMM YYYY')}`}
        </Menu.Item>,
      );
    });
    const t = _map(menuItems, (cat, i) => {
      if (cat.length) {
        return (
          <Menu.Item key={types[i]}>
            {types[i]}
            <Menu.Menu>
              {cat}
            </Menu.Menu>
          </Menu.Item>
        );
      }
      return null;
    });
    return t;
  }

  render() {
    return (
      <Menu vertical fixed="left" inverted className={s.sidebar}>
        <Menu.Item header active={this.props.active.route === 'profile'}>
          <Menu.Header as={Link} to="/profile">
            <Icon name="users" />
            <span> Client Profile</span>
          </Menu.Header>
        </Menu.Item>
        <Menu.Item active={this.props.active.route === 'audits'}>
          <Menu.Header as={Link} to="/audits">
            <Icon name="configure" />
            <span> Audits</span>
          </Menu.Header>
        </Menu.Item>
        {this.renderAudits()}
      </Menu>
    );
  }
}

export default withStyles(s)(Sidebar);
