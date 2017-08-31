import bookshelf from '../bookshelf';

import Clients from './clients';
import Scans from './scans';
import ServicePorts from './servicePorts';
import Vulnerabilities from './vulnerabilities';

export default bookshelf.Model.extend({
  tableName: 'machines',
  clients: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Clients, 'client_id');
  },
  scan: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Scans, 'scan_id');
  },
  servicePorts: function () { // eslint-disable-line func-names, object-shorthand
    return this.hasMany(ServicePorts, 'machine_id');
  },
  vulnerabilities: function () { // eslint-disable-line func-names, object-shorthand
    return this.hasMany(Vulnerabilities, 'machine_id');
  },
});

