import React from 'react';
import Audits from './Audits';
import Layout from '../../components/Layout';

async function action({ fetch, store, path }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }

  const resp = await fetch('/api/audit/all');
  const { data } = resp;

  if (!data || !data.audits) throw new Error('Failed to load the audit list.');

  const bc = [
    { id: `home_${path}`, link: { to: '/', name: 'Home' }, info: user.name },
    { id: `audits_${path}`, link: { to: '/audits', name: 'Audits' } },
  ];

  return {
    chunks: ['audits'],
    title: 'List of Audits',
    component: (
      <Layout path={bc} audits={data.audits} user={user}>
        <Audits audits={data.audits} />
      </Layout>
    ),
  };
}

export default action;
