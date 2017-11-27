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
          <span>inicio do projeto, ou seja, a data da primeira auditoria</span>
          <br />
          <span>nº de auditorias efetuadas por tipo</span>
          <br />
          <span>
            nº vulnerabilidades por auditoria, por diferentes tipos de
            vulnerabilidades (grau 1, 2, 3, 4)
          </span>
        </div>
      </div>
    );
  }
}

export default withStyles(semantic, s)(Home);
