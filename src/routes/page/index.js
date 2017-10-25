import React from 'react';
import Page from './Page';
import Layout from '../../components/Layout';

async function action({ params, fetch, store, path }) {
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

  const bc = [
    { id: `home_${path}`, link: { to: '/', name: 'Home' }, info: user.name },
    {
      id: `audits_${path}`,
      link: { to: '/audits', name: 'Audits' },
      info: data.page.audit_date,
    },
    {
      id: `audit${data.page.audit_id}_${path}`,
      link: { to: `/audit/${data.page.audit_id}`, name: 'Pages' },
      info: data.page.url,
    },
    {
      id: `audit${data.page.audit_id}_page_vulns_${path}`,
      info: 'All Vulnerabilities',
    },
  ];

  return {
    chunks: ['page'],
    title: 'Page info',
    component: (
      <Layout path={bc} audits={data.audits} user={user}>
        <Page page={data.page} />
      </Layout>
    ),
  };
}

export default action;
