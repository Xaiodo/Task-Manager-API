const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

require('dotenv/config');

const api = process.env.APi_URL;

console.log(process.env);

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


function print (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}



app._router.stack.forEach(print.bind(null, []))

app.listen(3000, () => {
  console.log('server is running http://localhost:3000');
});
