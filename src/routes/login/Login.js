import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import semantic from '!!isomorphic-style-loader!css-loader!../../../node_modules/semantic-ui-css/semantic.css'; // eslint-disable-line
import cx from 'classnames';
import s from './Login.css';
/* eslint-disable jsx-a11y/label-has-for */

class Login extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={cx(s.centerText, s.white)}>
            <strong>
              <span className={s.size}>
                DRC
                <span className={s.fontRed}>VIGILANTE</span>
              </span>
            </strong>
          </h1>
          <div className={s.formTitle}>
            <span className={s.formTitle}>Welcome.</span>
            <span className={s.formSubtitle}>Please, Login.</span>
          </div>
          <form className={s.form} method="post">
            <div className={s.formField}>
              <label className={s.label} htmlFor="usernameOrEmail">
                Username or email address:
              </label>
              <input
                className={s.formControl}
                id="userEmail"
                type="email"
                name="userEmail"
                placeholder="Email"
                autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              />
            </div>
            <div className={s.formField}>
              <label className={s.label} htmlFor="userPassword">
                Password:
              </label>
              <input
                className={s.formControl}
                id="userPassword"
                type="password"
                name="userPassword"
                placeholder="Password"
              />
            </div>
            <div className={s.formAction}>
              <input
                className={s.button}
                type="submit"
                name="commit"
                value="LOGIN"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

/* eslint-enable jsx-a11y/label-has-for */

export default withStyles(semantic, s)(Login);
