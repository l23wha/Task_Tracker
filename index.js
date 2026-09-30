import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve('tasks.json');

// Load the tasks
function loadTasks() {
    if (!fs.existsSync(FILE_PATH)) {
        return [];
    }
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save the tasks in file
function saveTask(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
}

// Add task
function addTask(description) {
    if (!description) {
        console.log("Please provide a task description");
        return;
    }

    const tasks = loadTasks();
    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        description: description,
        status: "todo",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
    };
    tasks.push(newTask);
    saveTask(tasks);
    console.log(`Added task ${newTask.id}: ${newTask.description}`);
}

// List tasks with optional filter
function listTasks(statusFilter = null) {
    let tasks = loadTasks();

    if (tasks.length === 0) {
        console.log('No Task found');
        return;
    }

    if (statusFilter === 'done') {
        tasks = tasks.filter((t) => t.status === 'completed');
    } else if (statusFilter === 'not-done') {
        tasks = tasks.filter((t) => t.status !== 'completed');
    } else if (statusFilter === 'in-progress') {
        tasks = tasks.filter((t) => t.status === 'in-progress');
    }

    if (tasks.length === 0) {
        console.log(`No tasks found for filter: ${statusFilter}`);
        return;
    }

    console.log("\n--- Your Todo List ---");
    tasks.forEach((t) => {
        let statusMark = ' ';
        if (t.status === 'completed') statusMark = '✔';
        else if (t.status === 'in-progress') statusMark = '⏳';

        console.log(`[${t.id}] [${statusMark}] (${t.status}) ${t.description}`);
    });
    console.log('----------------------\n');
}

// Mark task as done
function markDone(id) {
    const tasks = loadTasks();
    const taskId = Number(id);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
        console.log('No task found with this id');
        return;
    }

    task.status = 'completed';
    task.updatedAt = new Date().toLocaleString();
    saveTask(tasks);
    console.log(`Marked task ${id} as done`);
}

// Delete task
function deleteTask(id) {
    const tasks = loadTasks();
    const taskId = Number(id);
    const taskExists = tasks.some((t) => t.id === taskId);

    if (!taskExists) {
        console.log('No task found with this id');
        return;
    }

    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    saveTask(updatedTasks);
    console.log(`Task ${taskId} deleted successfully`);
}

// Update task
function updateTask(id, newDescription) {
    if (!newDescription) {
        console.log('Please provide the new description');
        return;
    }

    const tasks = loadTasks();
    const taskId = Number(id);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
        console.log("No task found with this id");
        return;
    }

    task.description = newDescription;
    task.updatedAt = new Date().toLocaleString();
    saveTask(tasks); // Pass full tasks array
    console.log(`Task ${id} description updated`);
}

// Mark status (todo, in-progress, completed)
function markupStatus(id, status) {
    const validStatus = ["todo", "in-progress", "completed"];
    if (!validStatus.includes(status)) {
        console.log("Please provide valid status: todo, in-progress, or completed");
        return;
    }

    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === Number(id));

    if (!task) {
        console.log('No task found with this id');
        return;
    }

    task.status = status;
    task.updatedAt = new Date().toLocaleString();
    saveTask(tasks); // Pass full tasks array
    console.log(`Marked task ${id} status as ${status}`);
}

// Command line arguments handle karne ke liye logic
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'add':
        addTask(args[1]);
        break;
    case 'update':
        updateTask(args[1], args[2]);
        break;
    case 'delete':
        deleteTask(args[1]);
        break;
    case 'mark-in-progress':
        markupStatus(args[1], 'in-progress');
        break;
    case 'mark-done':
        markupStatus(args[1], 'completed');
        break;
    case 'list':
        listTasks(args[1]); // args[1] optional hoga: 'done', 'todo', ya 'in-progress'
        break;
    default:
        console.log("Usage: node index.js <command> [arguments]");
        console.log("Commands: add, update, delete, mark-in-progress, mark-done, list");
        break;
}