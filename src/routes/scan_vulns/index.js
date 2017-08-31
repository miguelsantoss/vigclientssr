import React from 'react';
import Scan from './Scan';
import Layout from '../../components/Layout';

async function action({ params, fetch, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }

  const { id } = params;

  const auditList = await fetch('/api/audit/all');
  const scanWithID = await fetch(`/api/scan/${id}`);
  const data = { ...auditList.data, ...scanWithID.data };

  if (!data || !data.audits || !data.scan) {
    throw new Error('Failed to load scan info.');
  }
  return {
    chunks: ['scan_vuln'],
    title: 'Scan page',
    component: (
      <Layout audits={data.audits} user={user}>
        <Scan scan={data.scan} />
      </Layout>
    ),
  };
}

export default action;
