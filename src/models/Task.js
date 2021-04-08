const mongoose = require("../database/index");

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    priority: {
        type: String,
        enum: ['ALTA','BAIXA'],
        default: 'BAIXA',
        require: true
    },
    // Fica?
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    completed: {
        type: Boolean,
        require: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;