import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import semantic from '!!isomorphic-style-loader!css-loader!../../../node_modules/semantic-ui-css/semantic.css'; // eslint-disable-line
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {};

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Home</h1>
          <h1>Home</h1>
          <h1>Home</h1>
        </div>
      </div>
    );
  }
}

export default withStyles(semantic, s)(Home);
