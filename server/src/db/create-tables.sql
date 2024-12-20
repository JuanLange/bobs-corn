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

-- Drop existing function if exists
DROP FUNCTION IF EXISTS check_rate_limit(VARCHAR(45));

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(input_ip VARCHAR(45))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 
        FROM corn_purchases 
        WHERE client_ip = input_ip 
        AND success = true
        AND purchase_time > NOW() - INTERVAL '1 minute'
    );
END;
$$ LANGUAGE plpgsql;
