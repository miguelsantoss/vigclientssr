import React from 'react';
import Layout from '../../components/Layout';
import NotFound from './NotFound';

const title = 'Page Not Found';

async function action({ fetch, store, path }) {
  const { user } = store.getState();

  if (user) {
    const resp = await fetch('/api/audit/all');
    const { data } = resp;

    if (!data || !data.audits) {
      throw new Error('Failed to load the scan list.');
    }

    const bc = [
      { id: `home_${path}`, link: { to: '/', name: 'Home' }, info: user.name },
    ];

    const active = {
      route: 'home',
    };

    return {
      chunks: ['not-found'],
      title,
      component: (
        <Layout path={bc} active={active} audits={data.audits} user={user}>
          <NotFound title={title} />
        </Layout>
      ),
      status: 404,
    };
  }
  return {
    chunks: ['not-found'],
    title,
    component: <NotFound title={title} />,
    status: 404,
  };
}

export default action;
