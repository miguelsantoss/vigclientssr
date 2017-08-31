import moment from 'moment';
import bookshelf from '../bookshelf';

import Clients from './clients';

export default bookshelf.Model.extend({
  tableName: 'contacts',
  clients: function () { // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Clients, 'client_id');
  },
  toJSON: function () { // eslint-disable-line func-names, object-shorthand
    const attrs = bookshelf.Model.prototype.toJSON.apply(this, arguments);
    attrs.created_at = moment(this.get('created_at')).format('YYYY-MM-DD');
    attrs.updated_at = moment(this.get('updated_at')).format('YYYY-MM-DD');
    return attrs;
  },
});
