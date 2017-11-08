import knex from 'knex';
import bookshelf from 'bookshelf';
import knexConfig from './knexfile';

let config = knexConfig.development;

if (process.env.NODE_ENV === 'production') {
  config = knexConfig.production;
} else {
  config = knexConfig.development;
}

export default bookshelf(knex(config));
