import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import {
  Table,
  Grid,
  Segment,
  Container,
  Header,
  Label,
} from 'semantic-ui-react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import semantic from '!!isomorphic-style-loader!css-loader!../../../node_modules/semantic-ui-css/semantic.css'; // eslint-disable-line
import Link from '../../components/Link';

class Scan extends React.Component {
  static propTypes = {
    scan: PropTypes.shape({
      category: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      machines: PropTypes.arrayOf(
        PropTypes.shape({
          dns_name: PropTypes.string.isRequired,
          hostname: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
          ip_address: PropTypes.string.isRequired,
          mac_address: PropTypes.string.isRequired,
          operating_system: PropTypes.string.isRequired,
          scan_id: PropTypes.number.isRequired,
          servicePorts: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              machine_id: PropTypes.number.isRequired,
              port_number: PropTypes.number.isRequired,
              protocol: PropTypes.string.isRequired,
              service: PropTypes.string,
            }),
          ).isRequired,
        }),
      ).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRow: null,
      scan: props.scan,
    };
  }

  getMachineIndex = id => this.state.scan.machines.map(m => m.id).indexOf(id);

  handleRowClick = vuln => this.setState({ ...this.state, selectedRow: vuln });

  labelColor = risk => {
    const colors = ['blue', 'green', 'yellow', 'red', 'purple'];
    return colors[risk];
  };

  renderRelatedMachines = () =>
    <Table
      // toggle selectable only when scan is not loading or when machine is selected
      selectable={!(!this.state.scan || this.state.scan.fetchLoading)}
      compact
      basic="very"
      size="small"
      textAlign="center"
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>IP Address</Table.HeaderCell>
          <Table.HeaderCell>Source</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {this.renderRelatedMachineEntries()}
      </Table.Body>
    </Table>;

  renderRelatedMachineEntries = () => {
    const { machines } = this.state.scan;
    const { selectedRow } = this.state;

    if (!selectedRow) {
      return (
        <Table.Row>
          <Table.Cell colSpan="4">Select a vulnerability first.</Table.Cell>
        </Table.Row>
      );
    }

    return _map(selectedRow.relatedMachines, machine => {
      const machineIndex = this.getMachineIndex(machine.machine_id);
      return (
        <Table.Row key={machine.machine_id}>
          <Table.Cell>
            {machines[machineIndex].ip_address}
          </Table.Cell>
          <Table.Cell>
            <Link to={`/machine/${machine.machine_id}`}>Vulnerabilities</Link>
          </Table.Cell>
          <Table.Cell>
            <Link to={`/vulnerability/${machine.vuln_id}`}>Info</Link>
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  renderVulnerabilityList = () => {
    const tableStyle = {
      display: 'block',
      overflowY: 'scroll',
      height: '600px',
    };
    return (
      <Table
        // toggle selectable only when scan is not loading or when machine is selected
        selectable={!(!this.state.scan || this.state.scan.fetchLoading)}
        style={tableStyle}
        compact
        basic="very"
        size="small"
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Count</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.renderVulnerabilityEntries()}
        </Table.Body>
      </Table>
    );
  };

  renderVulnerabilityEntries = () => {
    const style = {
      padding: ' .2em .4em',
      textAlign: 'center',
      marginLeft: '1em',
      boxSizing: 'border-box',
      height: '17px',
      width: '18px',
      lineHeight: '1.2',
    };

    const { vulnerabilities } = this.state.scan;
    const { selectedRow } = this.state;

    return _map(vulnerabilities, vuln =>
      <Table.Row
        key={vuln.id}
        active={selectedRow && selectedRow.id === vuln.id}
        onClick={() => this.handleRowClick(vuln)}
      >
        <Table.Cell>
          <Label
            color={this.labelColor(vuln.risk_factor)}
            size="mini"
            style={style}
          >
            {vuln.risk_factor}
          </Label>
        </Table.Cell>
        <Table.Cell>
          <strong>
            {vuln.title}
          </strong>
        </Table.Cell>
        <Table.Cell>
          {vuln.count}
        </Table.Cell>
      </Table.Row>,
    );
  };

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Segment>
              <Header
                as="h4"
                icon="unordered list"
                content={`LIST OF VULNERABILITIES (${this.state.scan
                  ? this.state.scan.vulnerabilities.length
                  : ''})`}
              />
              {this.renderVulnerabilityList()}
            </Segment>
          </Grid.Column>
          <Grid.Column width={6}>
            <Segment>
              <Header
                as="h4"
                icon="laptop"
                content={`RELATED MACHINES (${this.state.selectedRow
                  ? this.state.selectedRow.relatedMachines.length
                  : ''})`}
              />
              {this.renderRelatedMachines()}
            </Segment>
            <Segment>
              <Container>
                <Header as="h4" icon="heartbeat" content="VULNERABILITIES" />
              </Container>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withStyles(semantic)(Scan);
