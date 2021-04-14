const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Task = require('../models/Task');
const User = require('../models/User');

const router = express.Router();

router.use(authMiddleware);


module.exports = {
    // List all the tasks of current user 
    async listTasks(req, res) {
        try {
            let result = [];
    
            let user = await User.findById(req.userId).exec();

            for (let taskId of user.tasks) {
                let task = await Task.findById(taskId).exec();
                result.push(task);
            }
    
            return res.send({ result });
        } catch (err) {
            return res.status(400).send( { error: 'Error ao listar as tarefas. ' + err } );
        }
    },
    // List the specific task 
    async listTaskId(req, res) {
        try {
            await User.findById(req.userId, function (err, user) {
                if (err) return err;
    
                if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );
            });
    
            let task = await Task.findById(req.params.taskId);
    
            return res.send({ task });
        } catch (err) {
            //return res.status(400).send( { error: 'Error ao listar a tarefa. ' + err } );
        }
    },
    // Create a new task
    async createTask(req, res) {
        try {
            let { name, priority, completed } = req.body;

            if (!name) return res.status(400).send({ error: 'Falha no registro: Nome da tarefa invalido' });
            let task = await Task.create({ name, priority, completed, assignedTo: req.userId} );            

            await User.findById(req.userId, function (err, user) {
                if (err) return err;
                
                user.tasks.push(task._id);
                user.save();
            }).select('+password');
    
            return res.send({ task });
        } catch (err) {
            return res.status(400).send( { error: 'Falha no registro. ' + err } );
        }
    },
    // Update the task
    async updateTask(req, res) {
        try {
            await User.findById(req.userId, function (err, user) {
                if (err) return err;
    
                if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );
            })
    
            let task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    
            await task.save();
    
            return res.send({ task });
        } catch (err) {
            return res.status(400).send( { error: 'Error ao atualizar a tarefa' } );
        }
    },
    // Delete task from DB
    async deleteTask(req, res) {
        try {
            await User.findById(req.userId, function (err, user) {
                if (err) return err;
    
                if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );
    
                user.tasks.splice(user.tasks.indexOf(req.params.taskId),1);
                user.save();
            }).select('+password');
    
            let task = await Task.findByIdAndDelete(req.params.taskId);
    
            return res.send({ task });
        } catch (err) {
            //return res.status(400).send( { error: 'Error ao deletar tarefa' } );
        }
    },
    // Order the list of tasks
    async orderListTask(req, res) {
        try {
            let user = await User.findById(req.userId).exec();
            let tasks = [];

            for (let taskId of user.tasks) {
                let task = await Task.findById(taskId).exec();
                tasks.push(task);
            }
            tasks.sort((a,b) => a.priority.localeCompare(b.priority));
    
            return res.send({ tasks });
        } catch (err) {
            return res.status(400).send( { error: 'Error ao ordenar as tarefas. ' + err } );
        }
    }
}