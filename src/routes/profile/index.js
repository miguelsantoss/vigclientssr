import React from 'react';
import Profile from './Profile';
import Layout from '../../components/Layout';

async function action({ fetch, store, path }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }

  const auditList = await fetch('/api/audit/all');
  const clientInfo = await fetch('/api/profile');
  const data = { ...auditList.data, ...clientInfo.data };

  if (!data || !data.audits || !data.info) {
    throw new Error('Failed to load the profile info.');
  }

  const bc = [
    { id: `home_${path}`, link: { to: '/', name: 'Home' }, info: user.name },
    { id: `profile_info_${path}`, link: { to: '/profile', name: 'Profile' } },
  ];

  const active = {
    route: 'profile',
  };

  return {
    chunks: ['profile'],
    title: 'Profile',
    component: (
      <Layout path={bc} active={active} user={user} audits={data.audits}>
        <Profile info={data.info} />
      </Layout>
    ),
  };
}

export default action;
