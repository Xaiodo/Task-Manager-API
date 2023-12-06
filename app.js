const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

require('dotenv/config');

const api = process.env.APi_URL;

const groupsRouter = require('./routes/groups');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');
const authJwt = require('./helpers/jwt');

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());

app.use(`${api}/groups`, groupsRouter);
app.use(`${api}/tasks`, tasksRouter);
app.use(`${api}/users`, usersRouter);

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'TaskManager',
}).then(() => {
  console.log('Database connection is ready');
}).catch((err) => {
  console.log(err);
});

app.listen(8080, () => {
  console.log('server is running http://localhost:8080');
});
