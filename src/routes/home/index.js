import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

async function action({ fetch, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }

  const auditList = await fetch('/api/audit/all');
  const { data } = auditList;
  data.news = [];

  if (!data || !data.audits) {
    throw new Error('Failed to load the audit list.');
  }
  return {
    chunks: ['home'],
    title: 'Home',
    component: (
      <Layout user={user} audits={data.audits}>
        <Home news={data.news} />
      </Layout>
    ),
  };
}

export default action;
