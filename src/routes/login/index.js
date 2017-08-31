import React from 'react';
import Layout from '../../components/Layout';
import Login from './Login';

const title = 'Log In';

function action({ store }) {
  const { user } = store.getState();
  if (user) {
    return { redirect: '/' };
  }
  return {
    chunks: ['login'],
    title,
    component: <Login title={title} />,
  };
}

export default action;
