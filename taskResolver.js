// taskResolver.js

let tasks = [
    {
        id: '1',
        title: ' Front-end development for e-commerce websites',
        description: ' Create a responsive user interface using React and Redux for an e-commerce website.',
        completed: false,
        duration: 120,
        userId: '1',
    },
    {
        id: '2',
        title: 'Back-end development for user authentication',
        description: " Implement an authentication and authorization system for a web application using Node.js, Express, and Passport.js",
        completed: false,
        duration: 90,
        userId: '2',
    },
    {
        id: '3',
        title: 'Testing and Quality Assurance for Web Applications',
        description: ' Develop and execute complete test plans and test cases.',
        completed: false,
        duration: 60,
        userId: '1',
    },
];

let users = [
    {
        id: '1',
        username: 'john_doe',
    },
    {
        id: '2',
        username: 'jane_doe',
    },
];

const taskResolver = {
    Query: {
        task: (_, { id }) => tasks.find(task => task.id === id),
        tasks: () => tasks,
        user: (_, { id }) => users.find(user => user.id === id),
        users: () => users,
    },
    Task: {
        user: (task) => users.find(user => user.id === task.userId),
    },
    User: {
        tasks: (user) => tasks.filter(task => task.userId === user.id),
    },
    Mutation: {
        addTask: (_, { title, description, completed, duration, userId }) => {
            const task = {
                id: String(tasks.length + 1),
                title,
                description,
                completed,
                duration,
                userId,
            };
            tasks.push(task);
            return task;
        },
        completeTask: (_, { id }) => {
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = true;
                return tasks[taskIndex];
            }
            return null;
        },
        changeDescription: (_, { id, description }) => {
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                tasks[taskIndex].description = description;
                return tasks[taskIndex];
            }
            return null;
        },
        deleteTask: (_, { id }) => {
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                const [deletedTask] = tasks.splice(taskIndex, 1);
                return deletedTask;
            }
            return null;
        },
        addUser: (_, { username }) => {
            const user = {
                id: String(users.length + 1),
                username,
            };
            users.push(user);
            return user;
        },
    },
};

module.exports = taskResolver;
