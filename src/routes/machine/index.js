import React from 'react';
import Machine from './Machine';
import Layout from '../../components/Layout';

async function action({ params, fetch, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }

  const { id } = params;
  const auditList = await fetch('/api/audit/all');
  const machineWithID = await fetch(`/api/machine/${id}`);
  const data = { ...auditList.data, ...machineWithID.data };

  if (!data || !data.audits || !data.machine) {
    throw new Error('Failed to load machine info.');
  }
  return {
    chunks: ['machine'],
    title: 'Machine page',
    component: (
      <Layout audits={data.audits} user={user}>
        <Machine machine={data.machine} />
      </Layout>
    ),
  };
}

export default action;
