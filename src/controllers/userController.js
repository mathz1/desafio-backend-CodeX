const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv/config')
const bcrypt = require('bcryptjs');

var blackList = [];

function generateToken(params = {}) {
    return jwt.sign(params, process.env.SECRET, { expiresIn: 86400 });
}

module.exports = {
    blackList,

    async create(req, res) {
        const { email } = req.body;

        try {
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: 'Usuário já existe.' });
            }

            const user = await User.create(req.body);

            user.password = undefined;

            return res.send({
                user,
                token: generateToken({ id: user.id })
            });
        } catch (err) {
            return res.status(400).send({ error: 'Falha no registro. ' + err })
        }
    },

    async login(req, res) {
        try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).send({ error: 'Usuário não existe.' });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ error: 'Senha inválida.' });
        }

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id }) 
         });
        } catch (err) {
            return res.status(400).send( { error: 'Falha ao realizar o login: ' + err } )
        }
        
    },

    async logout(req, res) {
        const token = req.headers.authorization;

        blackList.push(token);

        return res.send();
    }
}