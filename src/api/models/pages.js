import bookshelf from '../bookshelf';

import Audits from './audits';
import Clients from './clients';
import WebVulnerabilities from './webVulnerabilities';

export default bookshelf.Model.extend({
  tableName: 'pages',
  audits: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Audits, 'audit_id');
  },
  clients: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Clients, 'client_id');
  },
  webVulnerabilities: function () { // eslint-disable-line func-names, object-shorthand
    return this.hasMany(WebVulnerabilities, 'page_id');
  },
});

