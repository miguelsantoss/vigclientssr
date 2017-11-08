import React from 'react';
import Machine from './Machine';
import Layout from '../../components/Layout';

async function action({ params, fetch, store, path }) {
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

  const bc = [
    { id: `home_${path}`, link: { to: '/', name: 'Home' }, info: user.name },
    {
      id: `audits_${path}`,
      link: { to: '/audits', name: 'Audits' },
      info: data.machine.audit_date,
    },
    {
      id: `audit${data.machine.audit_id}_${path}`,
      link: { to: `/audit/${data.machine.audit_id}`, name: 'Scans' },
      info: data.machine.scan_network,
    },
    {
      id: `scan${data.machine.scan_id}_${path}`,
      link: { to: `/scan/${data.machine.scan_id}`, name: 'Machines' },
      info: data.machine.ip_address,
    },
    {
      id: `machine${data.machine.id}_info_${path}`,
      info: 'Vulnerabilities',
    },
  ];

  const active = {
    route: 'audit',
    id: data.machine.audit_id,
  };

  return {
    chunks: ['machine'],
    title: 'Machine page',
    component: (
      <Layout path={bc} active={active} audits={data.audits} user={user}>
        <Machine machine={data.machine} />
      </Layout>
    ),
  };
}

export default action;
