"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("../setup");
const User_1 = __importDefault(require("../../src/models/User"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
    let cookie;
    /**
     * userID stores the created user id
     * this is used for deleting user
     */
    let userID;
    /**
     * Register New User
     * @url '/user/create'
     * @method POST
     */
    describe('Register user', () => {
        it('should not register user if both passwords don\'t match', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .post('/user/create')
                .send({
                username: setup_1.testUser.username,
                password: setup_1.testUser.password,
                passwordConfirm: setup_1.testUser.wrongPassword
            })
                .set('Accept', 'application/json')
                .expect(422)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectValidationError);
        }));
        it('should register new user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .post('/user/create')
                .send({
                username: setup_1.testUser.username,
                password: setup_1.testUser.password,
                passwordConfirm: setup_1.testUser.password
            })
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect(() => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield User_1.default.findOne({
                    where: {
                        username: setup_1.testUser.username
                    }
                });
                expect(user).toBeTruthy();
                expect(user === null || user === void 0 ? void 0 : user.username).toBe(setup_1.testUser.username);
            }));
        }));
    });
    /**
     * Login recent created user
     * @url '/auth/login'
     * @method POST
     */
    describe('Login created user:', () => {
        it('should store session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield setup_1.request
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send({
                username: setup_1.testUser.username,
                password: setup_1.testUser.password
            })
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => {
                expect(response.headers['set-cookie']).toBeDefined();
                expect(response.headers['set-cookie'][0]).toMatch(/^connect.sid=/);
            });
            /**
             * Storing session cookie for furthers requests
             */
            cookie = response.headers['set-cookie'];
        }));
    });
    /**
     * Get Current User Data
     * @url '/user/current'
     * @method GET
     */
    describe('Getting created user data:', () => {
        it('will not return user data if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/user/current')
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        it('should return user data', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield setup_1.request
                .get('/user/current')
                .set('Cookie', cookie)
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => {
                expect(response.body.user).toMatchObject({
                    id: expect.any(String),
                    username: setup_1.testUser.username,
                    avatar: '/avatars/avatar-00.svg',
                    score: 0,
                    totalQuestions: 0,
                    successResponses: 0,
                    createdAt: expect.any(String)
                });
            });
            /**
             * Storing the created user id
             */
            userID = response.body.user.id;
        }));
    });
    /**
     * Updating User Password
     * @url '/user/update/password'
     * @method PUT
     * @method PATCH
     */
    describe('Updating user password:', () => {
        it('will not update user password if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .patch('/user/update/password')
                .send({
                password: setup_1.testUser.password,
                newPassword: setup_1.testUser.updatedPassword,
                newPasswordConfirm: setup_1.testUser.updatedPassword
            })
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        it('will not update user password if actual user password don\'t match', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .patch('/user/update/password')
                .set('Cookie', cookie)
                .send({
                password: setup_1.testUser.wrongPassword,
                newPassword: setup_1.testUser.updatedPassword,
                newPasswordConfirm: setup_1.testUser.updatedPassword
            })
                .expect(422)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectValidationError);
        }));
        it('will not update user password if both new passwords don\'t match', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .patch('/user/update/password')
                .set('Cookie', cookie)
                .send({
                password: setup_1.testUser.password,
                newPassword: setup_1.testUser.updatedPassword,
                newPasswordConfirm: setup_1.testUser.wrongPassword
            })
                .expect(422)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectValidationError);
        }));
        it('should update user password', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .patch('/user/update/password')
                .set('Cookie', cookie)
                .send({
                password: setup_1.testUser.password,
                newPassword: setup_1.testUser.updatedPassword,
                newPasswordConfirm: setup_1.testUser.updatedPassword
            })
                .expect(200)
                .expect('Content-Type', /application\/json/);
        }));
    });
    /**
     * Updating User Avatar
     * @url '/user/update/avatar'
     * @method PUT
     * @method PATCH
     */
    describe('Updating user avatar:', () => {
        it('will not update user avatar if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .patch('/user/update/avatar')
                .send({
                newAvatar: setup_1.testUser.updatedAvatar,
            })
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        it('will not update user avatar if newAvatar is in a diferent format', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .patch('/user/update/avatar')
                .set('Cookie', cookie)
                .send({
                newAvatar: setup_1.testUser.invalidAvatar,
            })
                .expect(422)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectValidationError);
        }));
        it('should update user avatar', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .patch('/user/update/avatar')
                .set('Cookie', cookie)
                .send({
                newAvatar: setup_1.testUser.updatedAvatar,
            })
                .expect(200)
                .expect('Content-Type', /application\/json/);
        }));
    });
    /**
     * Getting Users Leaderboard
     * @url '/user/getLeaderboard'
     * @method GET
     */
    describe('Getting users leaderboard:', () => {
        it('will not return users leaderboard if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/user/getLeaderboard')
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        it('Should return users leaderboard, ordered by score column', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/user/getLeaderboard')
                .set('Cookie', cookie)
                .expect(200)
                .expect('Content-Type', /application\/json/);
        }));
    });
    /**
     * Get all available user avatars
     * @url '/avatars/get'
     * @method GET
     */
    describe('Getting avatars:', () => {
        const getAvatarsCount = () => {
            const avatarsDir = path_1.default.join(__dirname, '../../public', 'avatars');
            try {
                const files = fs_1.default.readdirSync(avatarsDir);
                return files.filter(file => file.startsWith('avatar-') && file.endsWith('.svg')).length;
            }
            catch (error) {
                console.error(error);
                return 0;
            }
        };
        it('will not return avatars if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/avatars/get')
                .expect(401)
                .expect('Content-Type', /application\/json/);
        }));
        it('should return array of all avatars in public folder', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .get('/avatars/get')
                .set('Cookie', cookie)
                .expect(200)
                .expect('Content-Type', /application\/json/)
                .expect((response) => {
                expect(response.body.avatars.length).toEqual(getAvatarsCount());
            });
        }));
    });
    /**
     * Delete created user
     * @url '/user/delete'
     * @method DELETE
     */
    describe('Delete created user', () => {
        it('will not delete user if not send session cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .delete('/user/delete')
                .send({
                userID
            })
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectAuthenticationError);
        }));
        it('will not delete user if not send userID', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .delete('/user/delete')
                .set('Cookie', cookie)
                .expect(422)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectValidationError);
        }));
        it('will not delete user if password is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .delete('/user/delete')
                .set('Cookie', cookie)
                .send({
                password: setup_1.testUser.wrongPassword,
                userID
            })
                .expect(422)
                .expect('Content-Type', /application\/json/)
                .expect(setup_1.expectValidationError);
        }));
        it('Should delete current user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setup_1.request
                .delete('/user/delete')
                .set('Cookie', cookie)
                .send({
                password: setup_1.testUser.updatedPassword,
                userID
            })
                .expect(200)
                .expect('Content-Type', /application\/json/);
        }));
    });
});
