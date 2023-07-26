import { request, testUser } from '../setup'
import User from '../../src/models/User'

describe('Questions tests:', () => {

    /**
     * The cookie stores session cookie on user login
     * Cookie is used for persisting session between request
     */
    let cookie: string

    /**
     * Stores the correct answer of the question
     * This is used to test answering a question
     */
    let correctAnswer: string

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

    const updateCookie = () => it('should update session cookie', async () => {
        const response = await request
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({ 
            username: testUser.username, 
            password: testUser.password
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        cookie = response.headers['set-cookie']
    })

    /**
     * Get random question
     * @url '/question'
     * @method GET
     */
    describe('Getting random question:', () => {
        updateCookie()

        it('will not return question if not send session cookie', async () => {
            await request
            .get('/question')

            .expect(401)
            .expect('Content-Type', /application\/json/)
        })

        it('Should return random question', async () => {
            await request
            .get('/question')
            .set('Cookie', cookie)

            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( (response) => {
                expect(response.body).toMatchObject({
                    id: expect.any(Number), 
                    question: expect.any(String), 
                    correctAnswer: expect.any(String), 
                    options: expect.any(Array), 
                    points: expect.any(Number),
                    difficulty: expect.stringMatching(/^(Fácil|Moderado|Difícil)$/)
                })
            })
        })
    })

    /**
     * Send answer to active question
     * @url '/question'
     * @method POST
     * @method PUT
     * @method PATCH
     */
    describe('Sending answers:', () => {
        it('will not return response if not send session cookie', async () => {
            await request
            .put('/question')
            .set('Accept', 'application/json')
            .send({
                answer: 'correctAnswer'
            })

            .expect(401)
            .expect('Content-Type', /application\/json/)
        })
        
        describe('Sending incorrect answer:', () => {
            updateCookie()

            it('Should send incorrect answer', async () => {
                await request
                .put('/question')
                .set('Accept', 'application/json')
                .set('Cookie', cookie)
                .send({
                    answer: 'I\'m  a random response text'
                })
    
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect( (response) => {
                    expect(response.body.code).toBe('fail')
                })
            })
        })

        describe('Sending correct answer:', () => {
            updateCookie()

            it('should get new question', async () => {
                const response = await request
                .get('/question')
                .set('Cookie', cookie)
    
                .expect(200)
                .expect('Content-Type', /application\/json/)

                correctAnswer = response.body.correctAnswer
            })

            updateCookie()

            it('Should send correct answer', async () => {
                await request
                .put('/question')
                .set('Accept', 'application/json')
                .set('Cookie', cookie)
                .send({
                    answer: correctAnswer
                })
    
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect( (response) => {
                    expect(response.body.code).toBe('success')
                })
            })
        })
    })
})