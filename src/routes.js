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

// Routing tasks functions
routes.post('/tasks', tasksController.createTask);
routes.get('/tasks', tasksController.listTasks);
routes.get('/tasks/order', tasksController.orderListTask);
routes.get('/tasks/:taskId', tasksController.listTaskId);
routes.put('/tasks/:taskId', tasksController.updateTask);
routes.delete('/tasks/:taskId', tasksController.deleteTask);

// Exporting routes
module.exports = routes;