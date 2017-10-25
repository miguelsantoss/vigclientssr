import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import { Table, Grid, Segment, Header, Label } from 'semantic-ui-react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import semantic from '!!isomorphic-style-loader!css-loader!../../../node_modules/semantic-ui-css/semantic.css'; // eslint-disable-line

class Page extends React.Component {
  static propTypes = {
    page: PropTypes.shape({
      url: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      webVulnerabilities: PropTypes.arrayOf(PropTypes.shape({}).isRequired)
        .isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRow: null,
      page: props.page,
    };
  }

  labelColor = risk => {
    const colors = ['blue', 'green', 'yellow', 'red', 'purple'];
    return colors[risk];
  };

  renderVulnerabilityList = () =>
    <Table
      // toggle selectable only when scan is not loading
      selectable={!(!this.state.page || this.state.page.fetchLoading)}
      compact
      basic="very"
      size="small"
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>Title</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {this.renderVulnerabilityEntries()}
      </Table.Body>
    </Table>;

  renderVulnerabilityEntries = () => {
    const { webVulnerabilities } = this.state.page;
    if (webVulnerabilities.length === 0) {
      return (
        <Table.Row textAlign="center">
          <Table.Cell colSpan="3">
            No detected vulnerabilities on this page.
          </Table.Cell>
        </Table.Row>
      );
    }
    const style = {
      padding: ' .2em .4em',
      textAlign: 'center',
      marginLeft: '1em',
      boxSizing: 'border-box',
      height: '17px',
      width: '18px',
      lineHeight: '1.2',
    };
    return _map(webVulnerabilities, vuln =>
      <Table.Row key={vuln.id}>
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
          <Link to={`/webvulnerability/${vuln.id}`}>
            <strong>
              {vuln.title}
            </strong>
          </Link>
        </Table.Cell>
      </Table.Row>,
    );
  };

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <Header
                as="h4"
                icon="unordered list"
                content={`VULNERABILITY LIST (${this.state.page
                  ? this.state.page.webVulnerabilities.length
                  : ''})`}
              />
              {this.renderVulnerabilityList()}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withStyles(semantic)(Page);
