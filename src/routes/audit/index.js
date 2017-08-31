import React from 'react';
import Audit from './Audit';
import Layout from '../../components/Layout';

async function action({ params, fetch, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }

  const { id } = params;

  const auditList = await fetch('/api/audit/all');
  const auditWithID = await fetch(`/api/audit/${id}`);
  const data = { ...auditList.data, ...auditWithID.data };

  if (!data || !data.audits || !data.audit) {
    throw new Error('Failed to load the scan list.');
  }
  return {
    chunks: ['audit'],
    title: 'Audit page',
    component: (
      <Layout audits={data.audits} user={user}>
        <Audit audit={data.audit} />
      </Layout>
    ),
  };
}

export default action;
