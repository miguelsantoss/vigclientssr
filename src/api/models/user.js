import bookshelf from '../bookshelf';
import Clients from './clients';

export default bookshelf.Model.extend({
  tableName: 'clientusers',
  client: function () { // eslint-disable-line func-names, object-shorthand, prettier/prettier
    return this.hasOne(Clients, 'id', 'client_id');
  },
});
