import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Breadcrumb, Segment } from 'semantic-ui-react';
import normalizeCss from 'normalize.css';

import Link from '../Link';
import Sidebar from '../Sidebar';
import Appbar from '../Appbar';
import s from './Layout.css';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    audits: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    path: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        link: PropTypes.shape({
          to: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
        info: PropTypes.string,
      }),
    ).isRequired,
    active: PropTypes.shape({
      route: PropTypes.string.isRequired,
      id: PropTypes.number,
    }).isRequired,
  };

  renderBreadcrumbHistory = () => {
    const { path } = this.props;
    return (
      <Segment size="tiny" className={s.breadcrumb}>
        <Breadcrumb size="tiny">
          {this.renderCrumbs(path)}
        </Breadcrumb>
      </Segment>
    );
  };

  renderCrumbs = path => {
    if (!path && !path.length) return null;
    const crumbs = [];
    for (let i = 0; i < path.length; i += 1) {
      const section = [];
      if (path[i].link) {
        section.push(
          <Link key={`${path[i].id}-link`} to={path[i].link.to}>
            {path[i].link.name}
          </Link>,
        );
      }
      if (path[i].info) {
        if (path[i].link) {
          section.push(
            <span key={`${path[i].id}-info`}>
              {` | ${path[i].info}`}
            </span>,
          );
        } else {
          section.push(
            <span style={{ fontWeight: 'bold' }} key={`${path[i].id}-info`}>
              {`  ${path[i].info}`}
            </span>,
          );
        }
      }
      crumbs.push(
        <Breadcrumb.Section key={`${path[i].id}`}>
          {section}
        </Breadcrumb.Section>,
      );
      crumbs.push(
        <Breadcrumb.Divider key={`${path[i].id}-div`} icon="right angle" />,
      );
    }
    crumbs.pop();
    return (
      <div>
        {crumbs}
      </div>
    );
  };

  render() {
    return (
      <div>
        <Appbar user={this.props.user} />
        <Sidebar active={this.props.active} audits={this.props.audits} />
        <div className={s.main}>
          {this.renderBreadcrumbHistory()}
          <Grid className={s.contentGrid}>
            <Grid.Row>
              <Grid.Column />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.props.children}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
