import React from 'react';
import axios from 'axios';
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

  const logout = () => axios.post('/logout');

  if (!data || !data.audits) {
    throw new Error('Failed to load the audit list.');
  }
  return {
    chunks: ['home'],
    title: 'Home',
    component: (
      <Layout user={user} audits={data.audits} logout={logout}>
        <Home news={data.news} />
      </Layout>
    ),
  };
}

export default action;
