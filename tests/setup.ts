import supertest from 'supertest'
import App from '../src/app'
import sequelize from '../src/config/db'

const app = new App()

export const request = supertest(app.getApp())

export const testUser = {
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

export const expectAuthenticationError = (response: Response) => {
    expect(response.body).toMatchObject({
        code: 'error',
        message: 'Tienes que estar autenticado'
    })
}

export const expectValidationError = (response: Response) => {
    expect(response.body).toMatchObject({
        message: 'Error de validación'
    })
}