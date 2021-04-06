const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const userController = require('../controllers/userController');


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'Não forneceu o token.' });
    }

    const parts = authHeader.split(' ');

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token mal formado.' });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Token inválido.' });
        }

        req.userId = decoded.id;
        next();
    } )
}