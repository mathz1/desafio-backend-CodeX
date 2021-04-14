const jwt = require('jsonwebtoken');
require('dotenv/config');
const User = require('../models/User');
const { blackList } = require('../controllers/userController');


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'Não forneceu o token.' });
    }

    if (blackList.includes(authHeader)) {
        return res.status(401).send({ error: 'Token vencido.' });
    }

    const parts = authHeader.split(' ');

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token mal formado.' });
    }

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Token inválido.' });
        }

        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(400).send({ error: 'Usuário não existe.' });
        }

        req.userId = decoded.id;
        next();
    } )
}