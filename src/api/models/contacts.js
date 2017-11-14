import bookshelf from '../bookshelf';

import Clients from './clients';

export default bookshelf.Model.extend({
  tableName: 'contacts',
  clients() {
    // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Clients, 'client_id');
  },
});
