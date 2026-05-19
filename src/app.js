const express = require("express");
const cors = require('cors')
const morgan = require('morgan')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const userRouter = require('./routes/userRouter')
const app = express();

// middlewares 

app.use(cors())

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth System API',
      version: '1.0.0',
      description: 'Authentication API documentation',
      contact: {
        name: 'Development Team'
      }
    },
    servers: [ {
        url: process.env.BASE_URL || 'http://localhost:5000'
      }],
  },
  apis: ['./src/routes/*.js', './routes/*.js']
};

const swaggerDocument = swaggerJsDoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api/auth', userRouter)

// Health Check
app.get('/' , (req,res) =>{
    res.send('Auth API is running ... Check /api-docs for documentation')
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 
    ? res.statusCode 
    : 500;
    
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
})

module.exports = app;