import { request, testUser, expectAuthenticationError } from '../setup'
import User from '../../src/models/User'

describe('Authentication tests:', () => {
    
    /**
     * token is used for persisting session between request
     */
    let token: string

    beforeAll( async () => {
        await User.create({
            username: testUser.username,
            password: testUser.password
        })
    })

    afterAll( async () => {
        await User.destroy({
            where: {}, truncate: true
        })
    })

    /**
     * Authenticate user
     * @url '/auth/login'
     * @method POST
     */
    describe('Authenticating an user', () => {
        it('should not signin invalid user', async () => {
            await request
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send({ 
                username: testUser.username, 
                password: testUser.wrongPassword
            })
            .expect(401)
            .expect('Content-Type', /application\/json/)
        })

        it('should signin valid user', async () => {
            const response = await request
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send({ 
                username: testUser.username, 
                password: testUser.password
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( (response) => {
                expect(response.body.token).toBeDefined()
            })

            token = response.headers['set-token']
        })
    })

    /**
     * Logout an user
     * @url '/user/logout'
     * @method GET
     */
    describe('Logout an user', () => {
        it('should logout user', async () => {
            await request
            .get('/user/logout')
            .set('token', token)
            .set('Accept', 'application/json')

            .expect(200)
            .expect('Content-Type', /application\/json/)            
        })

        it('will not logout if don\'t send session token', async () => {
            await request
            .get('/user/logout')
            .set('Accept', 'application/json')

            .expect(401)
            .expect('Content-Type', /application\/json/) 
            .expect(expectAuthenticationError)           
        })
    })
})