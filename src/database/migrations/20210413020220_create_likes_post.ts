import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('likes_post', table => {
    table.uuid('id').notNullable().unique().defaultTo(knex.raw('uuid_generate_v4()')).primary()

    table.uuid('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable()
    table.uuid('post_id').references('id').inTable('posts').onUpdate('CASCADE').onDelete('CASCADE').notNullable()

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('likes_post')
}

