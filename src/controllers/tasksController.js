const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Task = require('../models/Task');
const User = require('../models/User')

const router = express.Router();

router.use(authMiddleware);


module.exports = {
    async listTasks(req, res) {
        try {
            let result = []
    
            let user = await User.findById(req.userId).exec();

            let userTasksId = user.tasks;

            /*let userTasksId = await User.findById(req.userId, function (err, user) {
                if (err) return err;
    
                return user.tasks
            })*/
    
            return res.send({ userTasksId })

            user.tasks.forEach( taskId => {
                //let task = await Task.findById(taskId)
                let task = Task.findById(taskId)
                result.push(task._id)
            })
    
            return res.send({ result })
        } catch (err) {
            return res.status(400).send( { error: 'Error ao listar as tarefas ' + err } )
        }
    },
    async listTaskId(req, res) {
        try {
        
            await User.findById(req.userId, function (err, user) {
                if (err) return err;
    
                if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );
            })
    
            let task = await Task.findById(req.params.taskId);
    
            return res.send({ task })
        } catch (error) {
            return res.status(400).send( { error: 'Error ao listar a tarefa' } )
        }
    },
    async createTask(req, res) {
        try {
            const task = await Task.create(req.body);
    
            
            let user = await User.findById(req.userId).exec();

            user.tasks.push(task._id);

            let userTasksId = user.tasks;
            
            user.markModified('tasks');

            user.save();
            
            return res.send({ user, task, userTasksId })

            

            /*
            await User.findById(req.userId, function (err, user) {
                if (err) return err;
                
                user.tasks.push(task._id)
            })*/
    
            return res.send({ task });
        } catch (err) {
            return res.status(400).send({ error: 'Falha no registro. ' + err })
        }
    },
    async updateTask(req, res) {
        try {
        
            await User.findById(req.userId, function (err, user) {
                if (err) return err;
    
                if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );
            })
    
            let task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    
            await task.save();
    
            return res.send({ task })
        } catch (error) {
            return res.status(400).send( { error: 'Error ao atualizar a tarefa' } )
        }
    },
    async deleteTask(req, res) {
        try {
        
            await User.findById(req.userId, function (err, user) {
                if (err) return err;
    
                if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );
    
                user.tasks.slice(user.tasks.indexOf(req.params.taskId),1)
            })
    
            await Task.findByIdAndDelete(req.params.taskId);
    
            return res.send()
        } catch (error) {
            return res.status(400).send( { error: 'Error ao deletar tarefa' } )
        }
    }
}


/*
// const || let

router.get('/tasks', async (req, res) => {
    try {
        let result = []

        let userTasksId = await User.findById(req.userId, function (err, user) {
            if (err) return err;

            return user.tasks
        })

        userTasksId.forEach( taskId => {
            result.push(await Task.findById(taskId))
        })

        return res.send({ result })
    } catch (error) {
        return res.status(400).send( { error: 'Error ao atualizar a tarefa' } )
    }
})

router.get('/tasks/:taskId', async (req, res) => {
    try {
        
        await User.findById(req.userId, function (err, user) {
            if (err) return err;

            // ????
            if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );
        })

        let task = await Task.findById(req.params.taskId);

        return res.send({ task })
    } catch (error) {
        return res.status(400).send( { error: 'Error ao atualizar a tarefa' } )
    }
})

router.post('/tasks', async (req, res) => {
    try {
        let task = await Task.create(req.body);

        await User.findById(req.userId, function (err, user) {
            if (err) return err;
            
            user.tasks.push(task._id)
        })

        return res.send({ task });
    } catch (err) {
        return res.status(400).send({ error: 'Falha no registro.' })
    }
})

router.put('/tasks/:taskId', async (req, res) => {
    try {
        
        await User.findById(req.userId, function (err, user) {
            if (err) return err;

            // ????
            if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );
        })

        let task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });

        await task.save();

        return res.send({ task })
    } catch (error) {
        return res.status(400).send( { error: 'Error ao atualizar a tarefa' } )
    }
})

router.delete('/tasks/:taskId', async (req, res) => {
    try {
        
        await User.findById(req.userId, function (err, user) {
            if (err) return err;

            // ????
            if (!user.tasks.includes(req.params.taskId)) return res.status(400).send( { error: 'Tarefa não cadastrada' } );

            user.tasks.slice(user.tasks.indexOf(req.params.taskId),1)
        })

        await Task.findByIdAndDelete(req.params.taskId);

        return res.send()
    } catch (error) {
        return res.status(400).send( { error: 'Error ao deletar tarefa' } )
    }
})

module.exports = {
    async index(req, res) {
        res.send({ ok: true });
    }
}
*/