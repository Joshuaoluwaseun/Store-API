require('dotenv').config()
require('express-async-errors')
const express = require('express');
const app = express();
const notFound = require('./middleware/not-found')
const product = require('./routes/products')
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');

app.use(express.json())
app.use('/api/v1/products', product) 

app.use(notFound);
app.use(errorHandlerMiddleware)

const port = process.env.port || 3000;

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI)

    app.listen(port, () => console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

startServer()
