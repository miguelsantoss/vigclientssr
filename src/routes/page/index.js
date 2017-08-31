import React from 'react';
import Page from './Page';
import Layout from '../../components/Layout';

async function action({ params, fetch, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }

  const { id } = params;

  const auditList = await fetch('/api/audit/all');
  const pageWithID = await fetch(`/api/page/${id}`);
  const data = { ...auditList.data, ...pageWithID.data };

  if (!data || !data.audits || !data.page) {
    throw new Error('Failed to load page info.');
  }
  return {
    chunks: ['page'],
    title: 'Page info',
    component: (
      <Layout audits={data.audits} user={user}>
        <Page page={data.page} />
      </Layout>
    ),
  };
}

export default action;
