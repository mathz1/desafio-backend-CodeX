const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/index');
const User = require('../../src/models/User');

describe('user', () => {
    beforeAll(async () => {
        await User.deleteMany();
    });

    afterAll(async () => {
        await connection.disconnect();
    });

    it('deve criar um novo user', async () => {
        const response_user_create = await request(app)
            .post('/register')
            .send({
                name: "Matheuzin",
                email: "chico@gmail.com",
	            password: "123456"
            });

        const nome = "Matheuzin";

        expect(response_user_create.body.user.name).toBe(nome);
    });
});