const express = require('express');
const apiRouter = require('./api/api-router');
const server = express();

server.use(express.json())

server.use('/api', logger, apiRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger (req, res, next) {
  console.log(`${req.method} request to ${req.originalUrl}`)
  next();
}





module.exports = server;
