require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/docs/swagger.yaml');

const express = require('express');
const app = express();

require('../config/configDb');
const authenticateUser = require('./middleware/authentication');
// routers
const authRouter = require('./Routes/auth');
const TasksRouter = require('./Routes/Tasks');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// compress all responses
const compression = require('compression');
app.use(compression());

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  res.send('<h1>Tasks API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', authenticateUser, TasksRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//const port = process.env.PORT || 4000;
//const env = process.env.NODE_ENV || 'development';

/* let server;
const start = async () => {
  try {
    server = app.listen(port, () =>
      console.log(`Server is listening on ${env} on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
}; */

//start();
module.exports = app;