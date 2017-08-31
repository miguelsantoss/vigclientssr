import moment from 'moment';
import bookshelf from '../bookshelf';

export default bookshelf.Model.extend({
  tableName: 'pages',
  toJSON: function () { // eslint-disable-line func-names, object-shorthand
    const attrs = bookshelf.Model.prototype.toJSON.apply(this, arguments);
    attrs.created_at = moment(this.get('created_at')).format('YYYY-MM-DD');
    attrs.updated_at = moment(this.get('updated_at')).format('YYYY-MM-DD');
    return attrs;
  },
});
