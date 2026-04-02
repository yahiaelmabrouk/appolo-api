// taskResolver.js

const { dbAll, dbGet, dbRun } = require('./database');

const taskResolver = {
    Query: {
        task: async (_, { id }) => {
            const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
            if (task) task.id = String(task.id);
            return task || null;
        },
        tasks: async () => {
            const tasks = await dbAll('SELECT * FROM tasks');
            return tasks.map(t => ({ ...t, id: String(t.id), completed: !!t.completed }));
        },
        user: async (_, { id }) => {
            const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
            if (user) user.id = String(user.id);
            return user || null;
        },
        users: async () => {
            const users = await dbAll('SELECT * FROM users');
            return users.map(u => ({ ...u, id: String(u.id) }));
        },
    },
    Task: {
        user: async (task) => {
            const user = await dbGet('SELECT * FROM users WHERE id = ?', [task.userId]);
            if (user) user.id = String(user.id);
            return user || null;
        },
        completed: (task) => !!task.completed,
    },
    User: {
        tasks: async (user) => {
            const tasks = await dbAll('SELECT * FROM tasks WHERE userId = ?', [user.id]);
            return tasks.map(t => ({ ...t, id: String(t.id), completed: !!t.completed }));
        },
    },
    Mutation: {
        addTask: async (_, { title, description, completed, duration, userId }) => {
            const result = await dbRun(
                'INSERT INTO tasks (title, description, completed, duration, userId) VALUES (?, ?, ?, ?, ?)',
                [title, description, completed ? 1 : 0, duration, userId || null]
            );
            return { id: String(result.lastID), title, description, completed, duration, userId };
        },
        completeTask: async (_, { id }) => {
            await dbRun('UPDATE tasks SET completed = 1 WHERE id = ?', [id]);
            const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
            if (task) { task.id = String(task.id); task.completed = !!task.completed; }
            return task || null;
        },
        changeDescription: async (_, { id, description }) => {
            await dbRun('UPDATE tasks SET description = ? WHERE id = ?', [description, id]);
            const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
            if (task) { task.id = String(task.id); task.completed = !!task.completed; }
            return task || null;
        },
        deleteTask: async (_, { id }) => {
            const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
            if (task) {
                task.id = String(task.id);
                task.completed = !!task.completed;
                await dbRun('DELETE FROM tasks WHERE id = ?', [id]);
            }
            return task || null;
        },
        addUser: async (_, { username }) => {
            const result = await dbRun('INSERT INTO users (username) VALUES (?)', [username]);
            return { id: String(result.lastID), username };
        },
    },
};

module.exports = taskResolver;
