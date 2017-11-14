import moment from 'moment';
import bookshelf from '../bookshelf';
import Clients from './clients';
import Scans from './scans';
import Pages from './pages';

export default bookshelf.Model.extend({
  tableName: 'audits',
  clients() {
    // eslint-disable-line func-names, object-shorthand
    return this.belongsTo(Clients, 'client_id');
  },
  scans() {
    // eslint-disable-line func-names, object-shorthand
    return this.hasMany(Scans, 'audit_id');
  },
  pages() {
    // eslint-disable-line func-names, object-shorthand
    return this.hasMany(Pages, 'audit_id');
  },
  toJSON() {
    // eslint-disable-line func-names, object-shorthand
    const attrs = bookshelf.Model.prototype.toJSON.apply(this, arguments); // eslint-disable-line
    attrs.initiated_at = moment(this.get('initiated_at')).format('YYYY-MM-DD');
    attrs.closed_at = attrs.closed_at
      ? moment(this.get('closed_at')).format('YYYY-MM-DD')
      : '';
    return attrs;
  },
});
