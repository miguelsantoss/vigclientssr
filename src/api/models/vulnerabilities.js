import bookshelf from '../bookshelf';

import Clients from './clients';
import Machines from './machines';

export default bookshelf.Model.extend({
  tableName: 'vulnerabilities',
  clients: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Clients, 'client_id');
  },
  machines: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Machines, 'machine_id');
  },
});
