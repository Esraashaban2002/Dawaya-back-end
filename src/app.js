const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const medicineRouter = require('./routes/medicineRouter');
const pharmacyRouter = require('./routes/pharmacyRouter');
const contactRouter = require('./routes/contactRouter');
const adminRouter = require('./routes/adminRouter');
const pharmacyDashRouter = require('./routes/pharmacyDashRouter');
const passport = require('./config/passport');

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
      title: 'Dawaya System API',
      version: '1.0.0',
      description: 'Authentication API documentation',
      contact: {
        name: 'Development Team'
      }
    },
    servers: [ {
        url: process.env.BASE_URL || 'https://dawaya-back-end.vercel.app' || 'http://localhost:5000'
      }],
  },
  apis: [__dirname + '/routes/*.js']
};

const swaggerDocument = swaggerJsDoc(swaggerOptions)

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js'
  ]
}))

// router  

app.use('/api/auth', authRouter);
app.use(passport.initialize())
app.use('/api/user', userRouter);
app.use('/api/medicines', medicineRouter);
app.use('/api/pharmacies', pharmacyRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);
app.use('/api/pharmacy', pharmacyDashRouter);


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