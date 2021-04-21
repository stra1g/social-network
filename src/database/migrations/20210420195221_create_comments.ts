import { Knex } from "knex";

import configs from '../../../knexfile'
const { onUpdateTrigger } = configs

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', table => {
    table.uuid('id').notNullable().unique().defaultTo(knex.raw('uuid_generate_v4()')).primary()
    
    table.text('comment').notNullable()
    table.uuid('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
    table.uuid('post_id').references('id').inTable('posts').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
    table.uuid('comment_reply').references('id').inTable('comments').onUpdate('CASCADE').onDelete('CASCADE')
    table.integer('likes_count').defaultTo(0)

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  }).then(() => knex.raw(onUpdateTrigger('comments')))
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('comments')
}
