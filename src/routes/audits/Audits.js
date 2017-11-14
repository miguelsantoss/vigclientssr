import React from 'react';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import _map from 'lodash/map';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Segment, Table, Header, Icon } from 'semantic-ui-react';
import semantic from '!!isomorphic-style-loader!css-loader!../../../node_modules/semantic-ui-css/semantic.css'; // eslint-disable-line

import Link from '../../components/Link';

class Audits extends React.Component {
  static propTypes = {
    audits: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        closed_at: PropTypes.string.isRequired,
        initiated_at: PropTypes.string.isRequired,
        serial_number: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      audits: props.audits,
      sort: {
        key: 'initiated_at',
        ascending: false,
      },
    };
  }

  sortAudits = (key, ascending) => {
    const auditList = _cloneDeep(this.state.audits);

    if (auditList !== 0) {
      switch (key) {
        case 'category':
          auditList.sort((a, b) => {
            if (a.category < b.category) return ascending ? -1 : 1;
            if (a.category > b.category) return ascending ? 1 : -1;
            return 0;
          });
          break;
        case 'initiated_at':
          auditList.sort((a, b) => {
            const aDate = new Date(a.initiated_at);
            const bDate = new Date(b.initiated_at);
            if (aDate < bDate) return ascending ? -1 : 1;
            if (aDate > bDate) return ascending ? 1 : -1;
            return 0;
          });
          break;
        case 'closed_at':
          auditList.sort((a, b) => {
            const aDate = new Date(a.closed_at);
            const bDate = new Date(b.closed_at);
            if (aDate < bDate) return ascending ? -1 : 1;
            if (aDate > bDate) return ascending ? 1 : -1;
            return 0;
          });
          break;
        default:
          break;
      }
      this.setState({
        ...this.state,
        audits: auditList,
        sort: { key, ascending },
      });
    }
  };

  handleSort = key => {
    const { sort } = this.state;
    if (!sort || sort.key !== key) this.sortAudits(key, true);
    else if (sort.key === key) this.sortAudits(key, !sort.ascending);
  };

  iconName = tableKey => {
    const { key, ascending } = this.state.sort;
    if (key === tableKey) {
      if (ascending) return 'triangle up';
    }
    return 'triangle down';
  };

  renderAudits = () =>
    _map(this.state.audits, audit =>
      <Table.Row key={audit.serial_number}>
        <Table.Cell>
          {audit.category}
        </Table.Cell>
        <Table.Cell>
          <Link to={`/audit/${audit.id}`}>
            {audit.initiated_at}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {audit.closed_at ? 'Closed' : 'Open'}
        </Table.Cell>
        <Table.Cell>
          {audit.closed_at}
        </Table.Cell>
      </Table.Row>,
    );

  render() {
    return (
      <Segment>
        <Header
          as="h4"
          icon="unordered list"
          content={`AUDIT LIST (${this.state.audits
            ? this.state.audits.length
            : ''})`}
        />
        <Table selectable compact basic="very" size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <span>Type </span>
                <Icon
                  name={this.iconName('category')}
                  size="small"
                  link
                  onClick={() => this.handleSort('category')}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <span>Date Iniciated</span>
                <Icon
                  name={this.iconName('initiated_at')}
                  size="small"
                  link
                  onClick={() => this.handleSort('initiated_at')}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <span>Status</span>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <span>Date Closed</span>
                <Icon
                  name={this.iconName('closed_at')}
                  size="small"
                  link
                  onClick={() => this.handleSort('closed_at')}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderAudits()}
          </Table.Body>
        </Table>
      </Segment>
    );
  }

  // render() {
  //   return (
  //     <div className={s.root}>
  //       <div className={s.container}>
  //         <h1>React.js News</h1>
  //       </div>
  //     </div>
  //   );
  // }
}

export default withStyles(semantic)(Audits);
