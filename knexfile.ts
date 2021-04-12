export default {

  development: {
    client: "pg",
    connection: {
      database: "social_network",
      user: "postgres",
      password: "postgres",
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
      extension: 'ts'
    }
  },

  test: {
    client: 'pg',
    connection: {
      database: 'social_network_test',
      user: 'postgres',
      password: 'postgres'
    },
    pool: {
      min: 1,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
      extension: 'ts'
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};
