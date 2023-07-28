import { request, testUser, expectAuthenticationError, expectValidationError } from '../setup'
import User from '../../src/models/User'
import fs from 'fs'
import path from 'path'

/**
 * User controller test
 * 
 * Endpoints tested:
 * @url '/user/create'
 * @url '/user/current'
 * @url '/user/update/password'
 * @url '/user/update/avatar'
 * @url '/user/getLeaderboard'
 * @url '/avatars/get'
 * @url '/user/delete'
 */

describe('User tests:', () => {
    
    /**
     * The cookie stores session cookie on user login
     * Cookie is used for persisting session between request
     */
    let cookie: string

    /**
     * userID stores the created user id
     * this is used for deleting user
     */
    let userID: string

    /**
     * Register New User
     * @url '/user/create'
     * @method POST
     */
    describe('Register user', () => {
        it('should not register user if both passwords don\'t match', async () => {
            await request
            .post('/user/create')
            .send({
                username: testUser.username,
                password: testUser.password,
                passwordConfirm: testUser.wrongPassword
            })
            .set('Accept', 'application/json')

            .expect(422)
            .expect('Content-Type', /application\/json/)
            .expect(expectValidationError)
        })

        it('should register new user', async () => {
            await request
            .post('/user/create')
            .send({
                username: testUser.username,
                password: testUser.password,
                passwordConfirm: testUser.password
            })
            .set('Accept', 'application/json')

            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( async () => {
                const user = await User.findOne({
                    where: {
                        username: testUser.username
                    }
                })

                expect(user).toBeTruthy()
                expect(user?.username).toBe(testUser.username)
            })
        })
    })

    /**
     * Login recent created user
     * @url '/auth/login'
     * @method POST
     */
    describe('Login created user:', () => {
        it('should store session cookie', async () => {
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

            /**
             * Storing session cookie for furthers requests
             */
            cookie = response.headers['set-cookie']
        })
    })

    /**
     * Get Current User Data
     * @url '/user/current'
     * @method GET
     */
    describe('Getting created user data:', () => {
        it('will not return user data if not send session cookie', async () => {
            await request
            .get('/user/current')
        
            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(expectAuthenticationError)
        })

        it('should return user data', async () => {
            const response = await request
            .get('/user/current')
            .set('Cookie', cookie)
        
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( (response) => {
                expect(response.body.user).toMatchObject({
                    id: expect.any(String),
                    username: testUser.username,
                    avatar: '/avatars/avatar-00.svg',
                    score: 0,
                    totalQuestions: 0,
                    successResponses: 0,
                    createdAt: expect.any(String)
                })
            } )

            /**
             * Storing the created user id
             */
            userID = response.body.user.id
        })
    })

    /**
     * Updating User Password
     * @url '/user/update/password'
     * @method PUT
     * @method PATCH
     */
    describe('Updating user password:', () => {
        it('will not update user password if not send session cookie', async () => {
            await request
            .patch('/user/update/password')
            .send({
                password: testUser.password,
                newPassword: testUser.updatedPassword,
                newPasswordConfirm: testUser.updatedPassword
            })

            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(expectAuthenticationError)
        })

        it('will not update user password if actual user password don\'t match', async () => {
            await request
            .patch('/user/update/password')
            .set('Cookie', cookie)
            .send({
                password: testUser.wrongPassword,
                newPassword: testUser.updatedPassword,
                newPasswordConfirm: testUser.updatedPassword
            })

            .expect(422)
            .expect('Content-Type', /application\/json/)
            .expect(expectValidationError)
        })

        it('will not update user password if both new passwords don\'t match', async () => {
            await request
            .patch('/user/update/password')
            .set('Cookie', cookie)
            .send({
                password: testUser.password,
                newPassword: testUser.updatedPassword,
                newPasswordConfirm: testUser.wrongPassword
            })

            .expect(422)
            .expect('Content-Type', /application\/json/)
            .expect(expectValidationError)
        })

        it('should update user password', async () => {
            await request
            .patch('/user/update/password')
            .set('Cookie', cookie)
            .send({
                password: testUser.password,
                newPassword: testUser.updatedPassword,
                newPasswordConfirm: testUser.updatedPassword
            })

            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
    })

    /**
     * Updating User Avatar
     * @url '/user/update/avatar'
     * @method PUT
     * @method PATCH
     */
    describe('Updating user avatar:', () => {
        it('will not update user avatar if not send session cookie', async () => {
            await request
            .patch('/user/update/avatar')
            .send({
                newAvatar: testUser.updatedAvatar,
            })

            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(expectAuthenticationError)
        })

        it('will not update user avatar if newAvatar is in a diferent format', async () => {
            await request
            .patch('/user/update/avatar')
            .set('Cookie', cookie)
            .send({
                newAvatar: testUser.invalidAvatar,
            })

            .expect(422)
            .expect('Content-Type', /application\/json/)
            .expect(expectValidationError)
        })

        it('should update user avatar', async () => {
            await request
            .patch('/user/update/avatar')
            .set('Cookie', cookie)
            .send({
                newAvatar: testUser.updatedAvatar,
            })

            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
    })

    /**
     * Getting Users Leaderboard
     * @url '/user/getLeaderboard'
     * @method GET
     */
    describe('Getting users leaderboard:', () => {
        it('will not return users leaderboard if not send session cookie', async () => {
            await request
            .get('/user/getLeaderboard')

            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(expectAuthenticationError)
        })

        it('Should return users leaderboard, ordered by score column', async () => {
            await request
            .get('/user/getLeaderboard')
            .set('Cookie', cookie)

            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
    })

    /**
     * Get all available user avatars
     * @url '/avatars/get'
     * @method GET
     */
    describe('Getting avatars:', () => {
        const getAvatarsCount = (): number => {
            const avatarsDir = path.join(__dirname, '../../public', 'avatars')

            try {
                const files = fs.readdirSync(avatarsDir)
                return files.filter(file => file.startsWith('avatar-') && file.endsWith('.svg')).length
            } catch (error) {
                console.error(error)
                return 0
            }
        }

        it('will not return avatars if not send session cookie', async () => {
            await request
            .get('/avatars/get')

            .expect(401)
            .expect('Content-Type', /application\/json/)
        })

        it('should return array of all avatars in public folder', async () => {
            await request
            .get('/avatars/get')
            .set('Cookie', cookie)

            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect( (response) => {
                expect(response.body.length).toEqual(getAvatarsCount())
            })
        })
    })

    /**
     * Delete created user
     * @url '/user/delete'
     * @method DELETE
     */
    describe('Delete created user', () => {
        it('will not delete user if not send session cookie', async () => {
            await request
            .delete('/user/delete')
            .send({
                userID
            })

            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(expectAuthenticationError)
        })

        it('will not delete user if not send userID', async () => {
            await request
            .delete('/user/delete')
            .set('Cookie', cookie)

            .expect(422)
            .expect('Content-Type', /application\/json/)
            .expect(expectValidationError)
        })

        it('will not delete user if password is wrong', async () => {
            await request
            .delete('/user/delete')
            .set('Cookie', cookie)
            .send({
                password: testUser.wrongPassword,
                userID
            })

            .expect(422)
            .expect('Content-Type', /application\/json/)
            .expect(expectValidationError)
        })
        
        it('Should delete current user', async () => {
            await request
            .delete('/user/delete')
            .set('Cookie', cookie)
            .send({
                password: testUser.updatedPassword,
                userID
            })

            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
    })
})