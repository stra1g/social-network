import { Knex } from "knex";

import configs from '../../../knexfile'
const { onUpdateTrigger } = configs

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.uuid('id').notNullable().unique().defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.text('name').notNullable()
    table.text('username').notNullable().unique()
    table.text('email').notNullable().unique()
    table.text('password').notNullable()
    table.text('biography')
    table.integer('following_count').defaultTo(0)
    table.integer('followers_count').defaultTo(0)

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  }).then(() => knex.raw(onUpdateTrigger('users')))
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}

