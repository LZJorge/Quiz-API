import { request, testUser, expectAuthenticationError } from '../setup'
import User from '../../src/models/User'
import { categories } from '../../src/seeds/categorySeed'

describe('Categories tests:', () => {

    /**
     * The cookie stores session cookie on user login
     * Cookie is used for persisting session between request
     */
    let cookie: string

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

    describe('Getting list of all categories:', () => {
        it('should get session cookie', async () => {
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
                expect(response.headers['set-cookie']).toBeDefined()
                expect(response.headers['set-cookie'][0]).toMatch(/^connect.sid=/)
            })
        
            cookie = response.headers['set-cookie']
        })

        it('will not get list of available categories if not send session cookie', async () => {
            await request
            .get('/category/get')
            .set('Accept', 'application/json')

            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(expectAuthenticationError)
        })

        it('should return list of available categories', async () => {
            await request
            .get('/category/get')
            .set('Accept', 'application/json')
            .set('Cookie', cookie)

            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( async (response) => {
                categories.map((category, key) => {
                    expect(response.body[key].name).toBe(category)
                })
            })
        })
    })
})