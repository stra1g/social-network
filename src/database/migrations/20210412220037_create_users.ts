import { Knex } from "knex";

//INSERT INTO users (name, username, email, password) VALUES ('luis', 'stra1g', 'isja@sad', '34434');

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.uuid('id').notNullable().unique().defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.text('name').notNullable()
    table.text('username').notNullable().unique()
    table.text('email').notNullable().unique()
    table.text('password').notNullable()
    table.text('biography')
    table.integer('following_count')
    table.integer('followers_count')

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}

