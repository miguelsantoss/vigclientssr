import bookshelf from '../bookshelf';

import Clients from './clients';
import Pages from './pages';

export default bookshelf.Model.extend({
  tableName: 'web_vulnerabilities',
  clients: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Clients, 'client_id');
  },
  pages: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Pages, 'page_id');
  },
});
