import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cornRoutes from './routes/cornRoutes';

// I load environment variables
dotenv.config();

// I create the Express application
const app = express();

// I configure middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type']
}));

// I configure Helmet with CORS settings
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan('dev'));
app.use(express.json());

// I set trust proxy to get client IP addresses
app.set('trust proxy', true);

// I define routes
app.use('/api/corn', cornRoutes);

// I add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: "Bob's Corn API is running! 🌽" });
});

// I define the port
const PORT = process.env.PORT || 3000;

// I start the server
app.listen(PORT, () => {
    console.log(`🌽 Bob's Corn server is running on port ${PORT}`);
});
