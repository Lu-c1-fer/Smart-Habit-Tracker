import pool from '../config/db.js';

const createUser = async ({name,email,password})=>{
    const {rows} = await pool.query(
        `INSERT INTO users (name, email, password)
        VALUES ($1,$2,$3)
        RETURNING id, name,email, created_at `,
        [name, email, password]
    );
    return rows[0];
};

const findByEmail= async (email)=>{
    const {rows}= await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    );
    return rows[0] ?? null; 
}

const findById = async (id)=>{
    const {rows}= await pool.query(`SELECT id, name, email, created_at FROM users WHERE id=$1`, [id]);
    return rows[0] ?? null;
}

export {createUser, findByEmail, findById};