import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
 ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false }  // Railway needs SSL
        : false                           // Local doesn't use SSL
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

export default pool;