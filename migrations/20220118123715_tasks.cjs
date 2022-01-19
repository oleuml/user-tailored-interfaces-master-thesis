
exports.up = function (knex) {
  return knex.schema.createTable('tasks', function (table) {
    table.primary(['uid', 'taskid']);
    table.integer('uid').notNullable();
    table.integer('taskid').notNullable();
    table.text('members').notNullable();
    table.bigInteger('start').notNullable();
    table.bigInteger('end').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('tasks')
};
