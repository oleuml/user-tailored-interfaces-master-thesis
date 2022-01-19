
exports.up = function (knex) {
  return knex.schema.createTable('task_tracking', function (table) {
    table.increments('id').primary().unsigned();
    table.integer('uid').notNullable();
    table.integer('taskid').notNullable();
    table.string('action').notNullable();
    table.string('position').notNullable();
    table.text('data');
    table.bigInteger('timestamp').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('task_tracking')
};
