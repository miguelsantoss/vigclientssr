import React from 'react';
import Scan from './Scan';
import Layout from '../../components/Layout';

async function action({ params, fetch, store, path }) {
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

  const bc = [
    { id: `home_${path}`, link: { to: '/', name: 'Home' }, info: user.name },
    {
      id: `audits_${path}`,
      link: { to: '/audits', name: 'Audits' },
      info: data.scan.audit_date,
    },
    {
      id: `audit${data.scan.audit_id}_${path}`,
      link: { to: `/audit/${data.scan.audit_id}`, name: 'Scans' },
      info: data.scan.network,
    },
    {
      id: `audit${data.scan.audit_id}_vulns_${path}`,
      info: 'All Vulnerabilities',
    },
  ];

  const active = {
    route: 'audit',
    id: data.scan.audit_id,
  };

  return {
    chunks: ['scan_vuln'],
    title: 'Scan page',
    component: (
      <Layout path={bc} active={active} audits={data.audits} user={user}>
        <Scan scan={data.scan} />
      </Layout>
    ),
  };
}

export default action;
