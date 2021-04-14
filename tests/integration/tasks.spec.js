const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/index');
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

describe('Tasks', () => {
    let token;
    let idTaskTest;
    beforeAll(async () => {
        await User.deleteMany();
        await Task.deleteMany();

        const response_user_login = await request(app).post('/register').send({
            name: "Lourival Netto",
            email: "lourival.netto",
            password: "1234"
        });

        token = 'Bearer ' + response_user_login.body.token;

        const response_task_before = await request(app).post('/tasks').send({
            name: "Test Task 1"
        }).set('authorization', token);

        idTaskTest = response_task_before.body.task._id;
    });

    afterAll(async () => {
        await connection.disconnect();
    })

    
    it('creating a task', async () => {
        const response_task_create = await request(app).post('/tasks').send({
            name: "Test Task 1"
        }).set('authorization', token);

        //Nome em branco
        const response_task_create_error = await request(app).post('/tasks').send({

        }).set('authorization', token);
        
        expect(response_task_create_error.body.error).toBe('Falha no registro: Nome da tarefa invalido');
        expect(response_task_create.body.task.name).toBe('Test Task 1');
        expect(response_task_create.body.task.priority).toBe('BAIXA');
    });
    
    it('updating task name', async () => {
        const response_task_update = await request(app).put('/tasks/' + idTaskTest).send({
            name: "Test Task 1 Update",
            completed: true
        }).set('authorization', token);

        expect(response_task_update.body.task.name).toBe('Test Task 1 Update');
        expect(response_task_update.body.task.completed).toBe(true);
    });
    
    it('getting task', async () => {
        const response_task_list = await request(app).get('/tasks/' + idTaskTest).set('authorization', token);

        //Tarefa não cadastrada pra esse usuario
        const response_task_list_error = await request(app).get('/tasks/123456').set('authorization', token);

        expect(response_task_list_error.body.error).toBe('Tarefa não cadastrada');
        expect(response_task_list.body.task.name).toBe('Test Task 1 Update');
    });
    
    it('deleting task', async () => {
        const response_task_delete = await request(app).delete('/tasks/' + idTaskTest).set('authorization', token);

        //Tarefa não cadastrada pra esse usuario
        const response_task_delete_error = await request(app).delete('/tasks/123456').set('authorization', token);

        expect(response_task_delete_error.body.error).toBe('Tarefa não cadastrada');
        expect(response_task_delete.body.task.name).toBe('Test Task 1 Update');
    });
})