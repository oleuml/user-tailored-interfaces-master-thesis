// Update with your config settings.

export const development = {
  client: 'mysql',
  useNullAsDefault: true,
  connection: {
    database: 'change-this',
    user: 'change-this',
    password: 'change-this'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
export const staging = {
  client: 'mysql',
  connection: {
    database: 'change-this',
    user: 'change-this',
    password: 'change-this'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
export const production = {
  client: 'mysql',
  connection: {
    database: 'change-this',
    user: 'change-this',
    password: 'change-this'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
