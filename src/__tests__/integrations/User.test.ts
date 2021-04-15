import request from 'supertest'

import app from '../../app'
import connection from '../../database/connection'

describe('Register', () => {
  beforeAll(async (done) => {
    await connection.migrate.latest()
    done()
  })

  afterAll(async (done) => {
    await connection('users').del()
    await connection.destroy()
    done()
  })

  it('should be able to create a new user', async (done) => {
    const response = await request(app).post('/register').send({
      name: "Luis Vitor",
      username: 'stra1g09',
      email: 'luis@stra1g.com',
      password: 'abc123abc',
      biography: 'any text'
    })
    expect(response.status).toBe(201)
    done()
  })

  it('should not be able to create a new user with the same email', async (done) => {
    const response = await request(app).post('/register').send({
      name: "Luis Vitor",
      username: 'stra1g',
      email: 'luis@stra1g.com',
      password: 'abc123abc',
      biography: 'any text'
    })
    expect(response.status).toBe(409)
    done()
  })
  it('should not be able to create a new user with the same username', async (done) => {
    const response = await request(app).post('/register').send({
      name: "Luis Vitor",
      username: 'stra1g09',
      email: 'luis@test.com',
      password: 'abc123abc',
      biography: 'any text'
    })
    expect(response.status).toBe(409)
    done()
  })
  it('should not be able to create a new user with invalid data', async (done) => {
    const response = await request(app).post('/register').send({
      name: "Luis Vitor",
      username: 343, // invalid type -> should be a string
      email: 'luis', // invalid type -> should be an email
      password: 'abc123abc',
      biography: 'any text'
    })

    expect(response.status).toBe(400)
    done()
  })
})