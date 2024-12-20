import { Pool } from 'pg';
import dotenv from 'dotenv';

// I load environment variables
dotenv.config();

// I create the database configuration
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'bobs_corn',
    password: process.env.DB_PASSWORD || 'admin',
    port: parseInt(process.env.DB_PORT || '5432'),
    // I add SSL support for production environments
    ...(process.env.NODE_ENV === 'production' && {
        ssl: {
            rejectUnauthorized: false
        }
    })
};

console.log('Database configuration:', {
    ...dbConfig,
    password: '****' // Hide password in logs
});

// I create the connection pool
const pool = new Pool(dbConfig);

// I add error handling for the pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// I test the connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(-1);
    } else {
        console.log('Successfully connected to the database at:', res.rows[0].now);
        
        // Check if the table exists
        pool.query('SELECT COUNT(*) FROM corn_purchases', (err, res) => {
            if (err) {
                console.error('Error checking corn_purchases table:', err);
                process.exit(-1);
            } else {
                console.log('corn_purchases table verified. Number of records:', res.rows[0].count);
            }
        });
    }
});

export default pool;
