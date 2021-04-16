import { Knex } from "knex";

import configs from '../../../knexfile'
const { onUpdateTrigger } = configs

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', table => {
    table.uuid('id').notNullable().unique().defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.text('description').notNullable()
    table.uuid('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
    table.integer('likes_count').defaultTo(0)

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  }).then(() => knex.raw(onUpdateTrigger('posts')))
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts')
}

