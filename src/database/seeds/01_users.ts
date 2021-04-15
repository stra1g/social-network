import { Knex } from "knex";

import { makeHash } from '../../utils/hash'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();


    const hashedPassword = await makeHash('123test')
    // Inserts seed entries
    await knex("users").insert([
        { 
          name: 'Luis Vitor', 
          username: "test1",
          email: 'luis@test1.com',
          password: hashedPassword,
          biography: 'any'
        },
        { 
          name: 'Luis Vitor', 
          username: "test2",
          email: 'luis@test2.com',
          password: hashedPassword,
          biography: 'any'
        },
        { 
          name: 'Luis Vitor', 
          username: "test3",
          email: 'luis@test3.com',
          password: hashedPassword,
          biography: 'any'
        },
    ]);
};
