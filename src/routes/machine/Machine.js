import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _escapeRegExp from 'lodash/escapeRegExp';
import { Table, Segment, Header, Input, Icon } from 'semantic-ui-react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import keyboardKey from '../../utils/keyboardKey';
import s from './Machine.css';

class Machine extends React.Component {
  static propTypes = {
    machine: PropTypes.shape({
      id: PropTypes.number.isRequired,
      ip_address: PropTypes.string.isRequired,
      hostname: PropTypes.string.isRequired,
      dns_name: PropTypes.string.isRequired,
      operating_system: PropTypes.string.isRequired,
      vulnerabilities: PropTypes.arrayOf(
        PropTypes.shape({
  
        }).isRequired,
      ).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      machine: props.machine,
      vulnerabilities: props.machine.vulnerabilities,
    };
  }

  handleSearchChange = e => {
    this.setState({ query: e.target.value }, () => {
      this.filterVulnerabilities();
    });
  };

  handleSearchKeyDown = e => {
    const code = keyboardKey.getCode(e);
    if (code === keyboardKey.Enter) {
      e.preventDefault();
      this.filterVulnerabilities();
    }
  };

  filterVulnerabilities = () => {
    const { query } = this.state;
    const { vulnerabilities } = this.props.machine;

    const re = new RegExp(_escapeRegExp(query), 'i');
    const isMatch = result => re.test(result.title);

    this.setState({
      ...this.state,
      machine: {
        ...this.state.machine,
        vulnerabilities: _filter(vulnerabilities, isMatch),
      },
    });
  };

  renderVulnerabilityEntries = () => {
    const { vulnerabilities } = this.state.machine;
    if (!vulnerabilities || vulnerabilities.length === 0) {
      return (
        <Table.Row textAlign="center">
          <Table.Cell colSpan="3">No vulnerabilities detected.</Table.Cell>
        </Table.Row>
      );
    }
    return _map(vulnerabilities, vuln =>
      <Table.Row key={vuln.id}>
        <Table.Cell>
          {vuln.vid}
        </Table.Cell>
        <Table.Cell>
          <Link to={`/vulnerability/${vuln.id}`}>
            {vuln.title}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {vuln.risk_factor}
        </Table.Cell>
      </Table.Row>,
    );
  };

  renderVulnerabilityList = () =>
    <Table selectable compact size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            <span>VID</span>
          </Table.HeaderCell>
          <Table.HeaderCell>
            <span>Title</span>
          </Table.HeaderCell>
          <Table.HeaderCell>
            <span>Risk</span>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {this.renderVulnerabilityEntries()}
      </Table.Body>
    </Table>;

  render() {
    return (
      <Segment>
        <Header as="h4" icon="unordered list" content="VULNERABILITIES" />
        <Input
          icon={<Icon name="search" />}
          placeholder="Filter Vulnerabilities"
          value={this.state.query}
          onChange={this.handleSearchChange}
          onKeyDown={this.handleSearchKeyDown}
        />
        {this.renderVulnerabilityList()}
      </Segment>
    );
  }
}

export default withStyles(s)(Machine);
