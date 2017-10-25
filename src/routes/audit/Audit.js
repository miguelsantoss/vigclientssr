import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _map from 'lodash/map';
import { Table, Segment, Header } from 'semantic-ui-react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import semantic from '!!isomorphic-style-loader!css-loader!../../../node_modules/semantic-ui-css/semantic.css'; // eslint-disable-line
import Link from '../../components/Link';

class Audit extends React.Component {
  static propTypes = {
    audit: PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      serial_number: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      closed_at: PropTypes.string.isRequired,
      scans: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          category: PropTypes.string.isRequired,
          network: PropTypes.string.isRequired,
        }),
      ).isRequired,
      pages: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  };

  renderTable = () => {
    const { scans } = this.props.audit;
    if (scans.length !== 0) {
      return this.renderScans();
    }
    return this.renderPages();
  };

  renderDateHeader = () => {
    const { audit } = this.props;
    return (
      <Header
        as="h4"
        icon="calendar check"
        content={`${moment(audit.created_at).format(
          'DD MMM YYYY',
        )} - ${audit.closed_at === ''
          ? ' (Open)'
          : moment(audit.created_at).format('DD MMM YYYY')}`}
      />
    );
  };

  renderScanEntries = () => {
    const { scans } = this.props.audit;
    if (scans.length === 0) {
      return null;
    }
    return _map(scans, scan =>
      <Table.Row key={scan.id}>
        <Table.Cell>
          <Link to={`/scan/${scan.id}`}>
            {scan.network}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {scan.category}
        </Table.Cell>
      </Table.Row>,
    );
  };

  renderScans = () => {
    const { scans } = this.props.audit;
    return (
      <div>
        <Table selectable compact basic="very" size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Network</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderScanEntries()}
          </Table.Body>
        </Table>
        {scans.length && <Header as="h4"> There are no scans here yet </Header>}
      </div>
    );
  };

  renderPageEntries = () => {
    const { pages } = this.props.audit;
    if (pages.length === 0) {
      return null;
    }
    return _map(pages, page =>
      <Table.Row key={page.id}>
        <Table.Cell>
          <Link to={`/page/${page.id}`}>
            {page.url}
          </Link>
        </Table.Cell>
      </Table.Row>,
    );
  };

  renderPages = () => {
    const { pages } = this.props.audit;
    return (
      <div>
        <Table selectable compact basic="very" size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>URL</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderPageEntries()}
          </Table.Body>
        </Table>
        {pages.length && <Header as="h4">There are no pages here yet</Header>}
      </div>
    );
  };

  render() {
    const { audit } = this.props;
    if (!audit) {
      return null;
    }
    return (
      <Segment>
        {this.renderDateHeader(audit)}
        {this.renderTable()}
      </Segment>
    );
  }
}

export default withStyles(semantic)(Audit);
