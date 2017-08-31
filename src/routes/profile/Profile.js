import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import _map from 'lodash/map';
import { Segment, Grid, Image } from 'semantic-ui-react';
import s from './Profile.css';

class Home extends React.Component {
  static propTypes = {
    info: PropTypes.shape({
      acronym: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      district: PropTypes.string.isRequired,
      fax: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      municipality: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      nif: PropTypes.string.isRequired,
      postal_code: PropTypes.string.isRequired,
      telephone: PropTypes.string.isRequired,
      website: PropTypes.string.isRequired,
      contacts: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
          department: PropTypes.string.isRequired,
          job_title: PropTypes.string.isRequired,
          mobile_phone: PropTypes.string.isRequired,
          telephone: PropTypes.string.isRequired,
          function: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  };

  renderContacts = () => {
    const { contacts } = this.props.info;
    if (contacts.length === 0) {
      return (
        <span>
          <br />No contacts available.
        </span>
      );
    }
    return _map(contacts, c =>
      <Segment key={c.name} style={{ background: '#ecf0f5' }}>
        <table className="contact">
          <tbody>
            <tr>
              <td>
                Name: <strong>{c.name}</strong>
              </td>
              <td>
                Mobile Phone: <strong>{c.mobilePhone}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Job Title: <strong>{c.jobTitle}</strong>
              </td>
              <td>
                Telephone: <strong>{c.telephone}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Function: <strong>{c.function}</strong>
              </td>
              <td>
                Email: <strong>{c.email}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Departament: <strong>{c.departament}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </Segment>,
    );
  };

  renderMainInfo = () => {
    const { info } = this.props;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image src="/placeholder.png" />
          </Grid.Column>
          <Grid.Column>
            <table className="profileInfo">
              <tbody>
                <tr>
                  <td>Name: </td>
                  <td>
                    {info.name}
                  </td>
                </tr>
                <tr>
                  <td>Website: </td>
                  <td>
                    {info.website}
                  </td>
                </tr>
                <tr>
                  <td>Telephone: </td>
                  <td>
                    {info.telephone}
                  </td>
                </tr>
              </tbody>
            </table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  renderLocationInfo = () => {
    const { info } = this.props;
    return (
      <table className="profileInfo">
        <tbody>
          <tr>
            <td>Address: </td>
            <td>
              {info.address}
            </td>
            <td>District: </td>
            <td>
              {info.district}
            </td>
          </tr>
          <tr>
            <td>Location: </td>
            <td>
              {info.location}
            </td>
            <td>Country: </td>
            <td>
              {info.country}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  render() {
    return (
      <Segment raised>
        <Segment style={{ background: '#ecf0f5' }}>
          {this.renderMainInfo()}
        </Segment>
        <Segment style={{ background: '#ecf0f5' }}>
          {this.renderLocationInfo()}
        </Segment>
        <span>Contacts:</span>
        {this.renderContacts()}
      </Segment>
    );
  }
}

export default withStyles(s)(Home);
