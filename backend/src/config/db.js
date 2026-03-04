
import {Pool} from "pg"; //pg doesn't have named exxports, so we destructuer from default

const pool = new Pool({
    host: process.env.DB_HOST,    // Database host(e.g. localhost)
    user: process.env.DB_USER,    // Database username
    password: process.env.DB_PASSWORD,  // Dababse password
    database: process.env.DB_NAME,   // Name of the habit tracker database
    port: process.env.DB_PORT,     // Default is usually 5432
});


//Test the connection on startup
pool.connect((err)=> {
if (err) {
    console.error('Database connection failed:', err.message);

} else{
    console.log('Connected to PostgreSQL');
}
});

export default pool;