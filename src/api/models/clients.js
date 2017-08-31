import bookshelf from '../bookshelf';

import Audits from './audits';
import Contacts from './contacts';
import Machines from './machines';
import Pages from './pages';
import Scans from './scans';
import Vulnerabilities from './vulnerabilities';
import WebVulnerabilities from './webVulnerabilities';

export default bookshelf.Model.extend({
  tableName: 'clients',
  audits: function () { // eslint-disable-line func-names, object-shorthand, prettier/prettier
    return this.hasMany(Audits, 'client_id');
  },
  contacts: function () { // eslint-disable-line func-names, object-shorthand, prettier/prettier
    return this.hasMany(Contacts, 'client_id');
  },
  machines: function () { // eslint-disable-line func-names, object-shorthand, prettier/prettier
    return this.hasMany(Machines, 'client_id');
  },
  pages: function () { // eslint-disable-line func-names, object-shorthand, prettier/prettier
    return this.hasMany(Pages, 'client_id');
  },
  scans: function () { // eslint-disable-line func-names, object-shorthand, prettier/prettier
    return this.hasMany(Scans, 'client_id');
  },
  vulnerabilities: function () { // eslint-disable-line func-names, object-shorthand, prettier/prettier
    return this.hasMany(Vulnerabilities, 'client_id');
  },
  webVulnerabilities: function () { // eslint-disable-line func-names, object-shorthand, prettier/prettier
    return this.hasMany(WebVulnerabilities, 'client_id');
  },
});
