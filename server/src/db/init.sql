-- Database initialization for Bob's Corn

-- Connect to postgres database first
\c postgres;

-- Drop database if exists
DROP DATABASE IF EXISTS bobs_corn;

-- Create database
CREATE DATABASE bobs_corn;

-- Connect to the new database
\c bobs_corn;

-- Enable timezone support
SET timezone = 'America/Argentina/Buenos_Aires';

-- Create corn_purchases table
CREATE TABLE IF NOT EXISTS corn_purchases (
    id SERIAL PRIMARY KEY,
    client_ip VARCHAR(45) NOT NULL,
    purchase_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT true
);

-- Create index for optimizing rate limiting queries
CREATE INDEX IF NOT EXISTS idx_purchases_ip_time 
ON corn_purchases(client_ip, purchase_time);

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(client_ip VARCHAR(45))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 
        FROM corn_purchases 
        WHERE client_ip = $1 
        AND success = true
        AND purchase_time > NOW() - INTERVAL '1 minute'
    );
END;
$$ LANGUAGE plpgsql;

-- Insert some test data
INSERT INTO corn_purchases (client_ip, purchase_time, success) VALUES
    ('192.168.1.1', NOW() - INTERVAL '2 minutes', true),
    ('192.168.1.2', NOW() - INTERVAL '3 minutes', true),
    ('192.168.1.1', NOW() - INTERVAL '30 seconds', true),
    ('192.168.1.3', NOW() - INTERVAL '1 minute', true),
    ('192.168.1.4', NOW() - INTERVAL '5 minutes', true);
