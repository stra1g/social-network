import request from 'supertest'

import app from '../../app'

import connection from '../../database/connection'

describe('Login', () => {
  beforeAll(async (done) => {
    await connection.seed.run()
    done()
  })

  afterAll(async (done) => {
    await connection('users').del()
    await connection.destroy()
    done()
  })

  it('should be able to login a user', async (done) => {
    const response = await request(app).post('/login').send({
      email: 'luis@test1.com',
      password: '123test',
    })
    expect(response.status).toBe(200)
    done()
  })

  it('should not be able to login a user with invalid email', async (done) => {
    const response = await request(app).post('/login').send({
      email: 'luis@doesnotexists.com',
      password: '123test',
    })
    expect(response.status).toBe(400)
    done()
  })

  it('should not be able to login a user with invalid password', async (done) => {
    const response = await request(app).post('/login').send({
      email: 'luis@test1.com',
      password: 'wrongpassword',
    })
    expect(response.status).toBe(400)
    done()
  })
})