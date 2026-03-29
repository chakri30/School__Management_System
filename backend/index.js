const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
const rateLimit = require('express-rate-limit')
const connectDB = require("./config/db.js")
const errorHandler = require("./middleware/errorHandler.js")
const Routes = require("./routes/route.js")

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB();

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Logging
app.use(morgan('dev'));

// Body Parser
app.use(express.json({ limit: '10mb' }))

// CORS
app.use(cors());

// Routes
app.use('/', Routes);

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})