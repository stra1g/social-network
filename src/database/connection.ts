import knex from 'knex'

import configs from '../../knexfile'

const enviroment = process.env.ENV || configs.development
const connection = process.env.NODE_ENV === 'test' ? knex(configs.test) : knex(enviroment)

export default connection