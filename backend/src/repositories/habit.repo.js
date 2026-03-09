import pool from '../config/db.js';

// create habit 
const createHabit = async ({userId, title, description, frequency, reminderTime,color})=>{
    const {rows}= await pool.query(
        `INSERT INTO habits(user_id, title, description, frequency, reminder_time)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,[userId, title, description, frequency, reminderTime] 
    );
    return rows[0];// why rows first column when you are returning all the columns
};

//find all habits by user
const findAllByUser = async(userId)=>{
    const {rows}= await pool.query(
        `SELECT * FROM habits
        WHERE user_id = $1 AND active = true
        ORDER BY created_at DESC`, [userId] // WHY order at descending order
    );
    return rows; // why return all rows and not only first
};

//find habits by habit and user id
const findByUser = async(id, userId)=>{
    const {rows}= await pool.query(
        `SELECT * FROM habits
        WHERE id= $1 AND user_id = $2`, [id, userId]
    )
    return rows[0] ?? null; // why? return from first row and why return null
};
//update habit 
const updateHabit = async(id, userId,updates)=>{
    const {rows}= await pool.query(   /*Using COALESCE IN UPDATE.
        This lets users update only the fields they want and wihtout sending the entire object. 
        a true patch behavior
        if the user updates $no. it will update with the new data but if it is null,
        the existing data will be there.
        */ 
                                           
        `UPDATE habits 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            frequency = COALESCE($3, frequency),
            reminder_time= COALESCE($4, reminder_time) 
        WHERE id= $5 AND user_id= $6
        RETURNING *`, [updates.title, updates.description, updates.frequency, updates.reminder_time,id, userId] // updates object gets created. 

    );
    return rows[0] ?? null;
};
//delete habit
const deleteHabit = async (id, userId)=>{
    const {rows}= await pool.query(
        `UPDATE habits SET active= false
        WHERE id = $1 AND user_id = $2
        RETURNING *`,
        [id, userId]
    );
    return rows[0] ?? null; // now why even return 
};
/*
Never delte the user-generated content. always softdelete, never hard delete
You can use to update streaks, for analytics, to recover and to audit
*/
export {createHabit, findAllByUser, findByUser, updateHabit,  deleteHabit};