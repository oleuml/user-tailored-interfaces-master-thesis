
exports.up = function (knex) {
  return knex.schema.createTable('answers', function (table) {
    table.primary(['uid', 'qid'])
    table.integer('uid').notNullable();
    table.string('qid').notNullable();
    table.string('answer').notNullable();
    table.bigInteger('createdAt').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('answers')
};
