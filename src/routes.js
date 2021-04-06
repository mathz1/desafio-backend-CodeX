const express = require("express");
const authMiddleware = require('./middlewares/auth');

const userController = require('./controllers/userController');
const tasksController = require('./controllers/tasksController');

const routes = express.Router();

routes.use('/tasks', authMiddleware);
routes.use('/logout', authMiddleware);

routes.post('/register', userController.create);
routes.post('/login', userController.login);
routes.put('/logout', userController.logout);

module.exports = routes;