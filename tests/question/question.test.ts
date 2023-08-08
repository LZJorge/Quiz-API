import { request, testUser, expectAuthenticationError } from '../setup'
import User from '../../src/models/User'

describe('Questions tests:', () => {

    /**
     * The cookie stores session cookie on user login
     * Cookie is used for persisting session between request
     */
    let cookie: string

    /**
     * Stores & points the correct answer of the question
     * This is used to test answering a question
     */
    let correctAnswer: string
    let points: number

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
        .expect( (response) => {
            expect(response.headers['set-cookie']).toBeDefined()
            expect(response.headers['set-cookie'][0]).toMatch(/^connect.sid=/)
        })
    
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
            .expect(expectAuthenticationError)
        })

        it('Should return random question', async () => {
            await request
            .get('/question')
            .set('Cookie', cookie)

            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( async (response) => {
                expect(response.body).toMatchObject({
                    id: expect.any(Number), 
                    question: expect.any(String), 
                    correctAnswer: expect.any(String), 
                    options: expect.any(Array), 
                    points: expect.any(Number),
                    difficulty: expect.stringMatching(/^(Fácil|Moderado|Difícil)$/)
                })

                const user = await User.findOne({
                    where: {
                        username: testUser.username
                    }
                })

                expect(user).toBeTruthy()
                expect(user?.totalQuestions).toBe(1)
                expect(user?.activeQuestion).toBe(response.body.id)
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
            .expect(expectAuthenticationError)
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
                .expect( async (response) => {
                    expect(response.body.code).toBe('fail')

                    const user = await User.findOne({
                        where: {
                            username: testUser.username
                        }
                    })

                    expect(user).toBeTruthy()
                    expect(user?.score).toBe(0)
                    expect(user?.activeQuestion).toBe(0)
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
                points = response.body.points
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
                .expect( async (response) => {
                    expect(response.body.code).toBe('success')

                    const user = await User.findOne({
                        where: {
                            username: testUser.username
                        }
                    })

                    expect(user).toBeTruthy()
                    expect(user?.score).toBe(points)
                    expect(user?.activeQuestion).toBe(0)
                })
            })
        })
    })

    /**
     * Get random question by especific category
     * @url '/question/:category'
     * @method GET
     */
    describe('Getting random question of especific category:', () => {
        let previousQuestion: any
        updateCookie()

        it('will not return question if not send session cookie', async () => {
            await request
            .get('/question/Deportes')

            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(expectAuthenticationError)
        })

        it('will not return random question if category don\'t exists', async () => {
            await request
            .get('/question/unexistent-category')
            .set('Cookie', cookie)

            .expect(400)
            .expect('Content-Type', /application\/json/)
            .expect( (response) => {
                expect(response.body).toMatchObject({
                    code: 'error',
                    message: 'No existe esa categoría'
                })
            })
        })

        it('Should return random question by especific category', async () => {
            const response = await request
            .get('/question/deportes')
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
                    difficulty: expect.stringMatching(/^(Fácil|Moderado|Difícil)$/),
                    Category: {
                        name: expect.stringMatching(/Deportes/)
                    }
                })
            })

            previousQuestion = response.body
        })

        updateCookie()

        it('Should return same question if has active question of same especific category', async () => {
            await request
            .get('/question/deportes')
            .set('Cookie', cookie)

            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( (response) => {
                expect(response.body).toMatchObject(previousQuestion)
            })    
        })

        it('Should return same question if has active question and category param is not normalized ', async () => {
            await request
            .get('/question/dEpÓrtEs')
            .set('Cookie', cookie)

            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( (response) => {
                expect(response.body).toMatchObject(previousQuestion)
            })    
        })
    })
})