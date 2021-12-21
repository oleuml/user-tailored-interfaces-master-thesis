
exports.up = function (knex) {
  return knex.schema.createTable('proband_data', function (table) {
    table.string('token').primary();
    table.string('userAgent').notNullable();
    table.string('initScreenSize').notNullable();
    table.bigInteger('createdAt').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('proband_data')
};
