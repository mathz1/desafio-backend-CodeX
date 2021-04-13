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

    it('cases of errors and successfully register', async () => {
        const response_user_create = await request(app)
            .post('/register')
            .send({
                name: "Matheuzin",
                email: "chico@gmail.com",
	            password: "123456"
            });

        //user exist
        const response_user_create2 = await request(app)
            .post('/register')
            .send({
                name: "Rafa",
                email: "chico@gmail.com",
	            password: "1236"
            });

        expect(response_user_create2.body.error).toBe('Usuário já existe.');
        expect(response_user_create.body.user.name).toBe('Matheuzin');
        expect(response_user_create.body).toHaveProperty('token');
        expect(response_user_create.body.token).toBeDefined();
    });

    it('cases of errors and successfully login', async () => {
        const response_user_login = await request(app)
            .post('/login')
            .send({
                email: "chico@gmail.com",
                password: "123456"
            });

        //usuario com senha invalida
        const response_user_login2 = await request(app)
            .post('/login')
            .send({
                email: "chico@gmail.com",
                password: "12345"
            });

        //usuario inexistente
        const response_user_login3 = await request(app)
            .post('/login')
            .send({
                email: "rafa@gmail.com",
                password: "123456"
            });

        expect(response_user_login3.body.error).toBe('Usuário não existe.');
        expect(response_user_login2.body.error).toBe('Senha inválida.');
        expect(response_user_login.body.token).toBeDefined();
        expect(response_user_login.body.user.name).toBe('Matheuzin');
        expect(response_user_login.body.user.email).toBe('chico@gmail.com');
    });

    it('cases of errors and successfully logout', async () => {
        const response_user_login = await request(app)
            .post('/login')
            .send({
                email: "chico@gmail.com",
                password: "123456"
            });

        const token = 'Bearer ' + response_user_login.body.token;

        //malformed token user
        const response_user_logout0 = await request(app)
            .put('/logout')
            .set('authorization', response_user_login.body.token);

        //user with the right token
        const response_user_logout1 = await request(app)
            .put('/logout')
            .set('authorization', token);
        
        //user with expired token
        const response_user_logout2 = await request(app)
            .put('/logout')
            .set('authorization', token);

        //user without token
        const response_user_logout3 = await request(app)
            .put('/logout');

        expect(response_user_logout0.body.error).toBe('Token mal formado.');
        expect(response_user_logout1.status).toBe(200);
        expect(response_user_logout2.body.error).toBe('Token vencido.');
        expect(response_user_logout3.body.error).toBe('Não forneceu o token.');
    });
});