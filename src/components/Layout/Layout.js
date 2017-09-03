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
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      history: null,
    };
  }

  // componentWillReceiveProps = nextProps => {
  //   this.setState({
  //     ...this.state,
  //     history: this.handleNewRoute(nextProps.location.pathname, nextProps),
  //   });
  // };

  handleNewRoute = (pathname, props) => {
    const route = pathname.split('/');
    if (props && route[1] && route[1] !== '') {
      const { audits } = props;
      const { scans } = props;
      const { pages } = props;
      const { machines } = props;
      const { vulnerabilities } = props;
      const { webvulnerabilities } = props;
      let audit;
      let scan;
      let page;
      let machine;
      let vulnerability;
      let webvulnerability;
      switch (route[1]) {
        case 'profile':
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <span>Profile</span>
              </Breadcrumb.Section>
            </div>
          );
        case 'audits':
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
                <span>
                  {' '}| {props.client.name}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to="/audits/">Audits</Link>
              </Breadcrumb.Section>
            </div>
          );
        case 'audit':
          for (let i = 0; i < audits.length; i += 1) {
            if (audits[i].id === parseInt(route[2], 10)) {
              audit = audits[i];
            }
          }
          if (!audit) return null;
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
                <span>
                  {' '}| {props.client.name}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to="/audits/">Audits</Link>
                <span>
                  {' '}| {audit.created_at}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/audit/${route[2]}`}>
                  {audit.category === 'web' ? 'Pages' : 'Scans'}
                </Link>
              </Breadcrumb.Section>
            </div>
          );
        case 'scan':
          for (let i = 0; i < scans.length; i += 1) {
            if (scans[i].id === parseInt(route[2], 10)) {
              scan = scans[i];
            }
          }

          if (!scan) {
            return null;
          }
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
                <span>
                  {' '}| {props.client.name}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to="/audits/">Audits</Link>
                <span>
                  {' '}| {scan.audit_date}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/audit/${scan.audit_id}`}>Scans</Link>
                <span>
                  {' '}| {scan.network}
                </span>
              </Breadcrumb.Section>
              {route[3] &&
                route[3] === 'vulnerabilities' &&
                <Breadcrumb.Divider icon="right angle" />}
              {route[3] &&
                route[3] === 'vulnerabilities' &&
                <Breadcrumb.Section>
                  <strong>All Vulnerabilities</strong>
                </Breadcrumb.Section>}
            </div>
          );
        case 'page':
          for (let i = 0; i < pages.length; i += 1) {
            if (pages[i].id === parseInt(route[2], 10)) {
              page = pages[i];
            }
          }

          if (!page) {
            return null;
          }
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
                <span>
                  {' '}| {props.client.name}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to="/audits/">Audits</Link>
                <span>
                  {' '}| {page.audit_date}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/audit/${page.audit_id}`}>Scans</Link>
                <span>
                  {' '}| {page.url}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <strong>All Vulnerabilities</strong>
              </Breadcrumb.Section>
            </div>
          );

        case 'machine':
          for (let i = 0; i < machines.length; i += 1) {
            if (machines[i].id === parseInt(route[2], 10)) {
              machine = machines[i];
            }
          }
          if (!machine) {
            return null;
          }
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
                <span>
                  {' '}| {props.client.name}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to="/audits/">Audits</Link>
                <span>
                  {' '}| {machine.audit_date}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/audit/${machine.audit_id}`}>Scans</Link>
                <span>
                  {' '}| {machine.scan_network}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/scan/${machine.scan_id}`}>Machines</Link>
                <span>
                  {' '}| {machine.ip_address}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <strong>Vulnerabilities</strong>
              </Breadcrumb.Section>
            </div>
          );
        case 'webvulnerability':
          for (let i = 0; i < webvulnerabilities.length; i += 1) {
            if (webvulnerabilities[i].id === parseInt(route[2], 10)) {
              webvulnerability = webvulnerabilities[i];
            }
          }
          if (!webvulnerability) {
            return null;
          }
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
                <span>
                  {' '}| {props.client.name}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to="/audits/">Audits</Link>
                <span>
                  {' '}| {webvulnerability.audit_date}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/audit/${webvulnerability.audit_id}`}>Pages</Link>
                <span>
                  {' '}| {webvulnerability.page_url}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/page/${webvulnerability.page_id}`}>
                  Web Vulnerabilities
                </Link>
                <span>
                  {' '}| id:{webvulnerability.id}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <strong>Details</strong>
              </Breadcrumb.Section>
            </div>
          );
        case 'vulnerability':
          for (let i = 0; i < vulnerabilities.length; i += 1) {
            if (vulnerabilities[i].id === parseInt(route[2], 10)) {
              vulnerability = vulnerabilities[i];
            }
          }
          if (!vulnerability) {
            return null;
          }
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
                <span>
                  {' '}| {props.client.name}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to="/audits/">Audits</Link>
                <span>
                  {' '}| {vulnerability.audit_date}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/audit/${vulnerability.audit_id}`}>Scans</Link>
                <span>
                  {' '}| {vulnerability.scan_network}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/scan/${vulnerability.scan_id}`}>Machines</Link>
                <span>
                  {' '}| {vulnerability.machine_ip}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <Link to={`/machine/${vulnerability.machine_id}`}>
                  Vulnerabilities
                </Link>
                <span>
                  {' '}| vid:{vulnerability.vid}
                </span>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                <strong>Details</strong>
              </Breadcrumb.Section>
            </div>
          );
        default:
          return (
            <div>
              <Breadcrumb.Section>
                <Link to="/">Home</Link>
              </Breadcrumb.Section>
            </div>
          );
      }
    }
    return (
      <div>
        <Breadcrumb.Section>
          <Link to="/">Home</Link>
        </Breadcrumb.Section>
      </div>
    );
  };

  renderBreadcrumbHistory = () => {
    const { history } = this.state;
    return (
      <Segment size="tiny" className={s.breadcrumb}>
        <Breadcrumb size="tiny">
          {history}
        </Breadcrumb>
      </Segment>
    );
  };

  render() {
    return (
      <div>
        <Appbar user={this.props.user} />
        <Sidebar audits={this.props.audits} />
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
