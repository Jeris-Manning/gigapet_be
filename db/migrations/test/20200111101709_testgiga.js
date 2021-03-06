exports.up = function(knex) {
  return knex.schema
    .createTable('parents', (tbl) => {
      tbl.increments('id').primary();
      tbl
        .string('username')
        .unique()
        .notNullable();
      tbl.string('password').notNullable();
    })
    .createTable('children', (tbl) => {
      tbl.increments('id').primary();
      tbl.string('name').notNullable();
      tbl.integer('parent_id');
      tbl.integer('parent_2_id');
    })
    .createTable('food_entries', (tbl) => {
      tbl.increments('id').primary();
      tbl.date('date').defaultTo(knex.raw('now()'));
      tbl.integer('dairy').defaultTo(0);
      tbl.integer('fruits').defaultTo(0);
      tbl.integer('grains').defaultTo(0);
      tbl.integer('proteins').defaultTo(0);
      tbl.integer('vegetables').defaultTo(0);
      tbl.integer('treats').defaultTo(0);
      tbl.integer('child_id').notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('food_entries')
    .dropTableIfExists('children')
    .dropTableIfExists('parents');
};
