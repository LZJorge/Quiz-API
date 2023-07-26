import supertest from 'supertest'
import App from '../src/app'
import sequelize from '../src/config/db'

const app = new App()

const request = supertest(app.getApp())

const testUser = {
    username: 'testuser',
    password: 'testpassword',
    wrongPassword: 'wrong-test-pass',
    updatedPassword: '0123456789',
    updatedAvatar: '/avatars/avatar-05.svg',
    invalidAvatar: '/invalid/avatar-019.svg'
}

beforeAll( async () => {   
    await app.startServer()
})

afterAll( async () => {
    await app.stopServer()
    await sequelize.close()
})

export { request, testUser }