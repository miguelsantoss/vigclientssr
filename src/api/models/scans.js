import bookshelf from '../bookshelf';

import Audits from './audits';
import Clients from './clients';
import Machines from './machines';

export default bookshelf.Model.extend({
  tableName: 'scans',
  audits: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Audits, 'audit_id');
  },
  clients: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Clients, 'client_id');
  },
  machines: function () { // eslint-disable-line func-names, object-shorthand
    return this.hasMany(Machines, 'scan_id');
  },
});
