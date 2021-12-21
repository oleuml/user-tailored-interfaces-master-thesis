import { development, production } from '../../../knexfile'
import knex from 'knex';
import { mode } from '$app/env';

const environment = mode || 'development'
let config;
switch (environment) {
  case "development": config = development;
  case "production": config = production;
  default: config = development;
}

export default knex(config);
