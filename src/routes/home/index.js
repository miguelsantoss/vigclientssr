import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

async function action({ fetch, store, path }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }

  const auditList = await fetch('/api/audit/all');
  const { data } = auditList;

  if (!data || !data.audits) {
    throw new Error('Failed to load the audit list.');
  }
  const bc = [
    { id: `home_${path}`, link: { to: '/', name: 'Home' }, info: user.name },
  ];

  const active = {
    route: 'home',
  };

  return {
    chunks: ['home'],
    title: 'Home',
    component: (
      <Layout path={bc} active={active} user={user} audits={data.audits}>
        <Home news={data.news} />
      </Layout>
    ),
  };
}

export default action;
