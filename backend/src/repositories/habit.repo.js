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

// logHabit

const logHabit = async (habitId, userId) =>{
    const today = new Date().toISOString().split('T')[0]; //'2026-03-10'did we stringify. .split('T') [0], split the value afer t including it and [0 ] dtakes the first string .i.e date.

    const {rows} = await pool.query(
        `INSERT INTO habit_logs(habit_id, user_id, log_date, status)
        VALUES ($1,$2,$3,true)
        ON CONFLICT (habit_id, user_id, log_date)
        DO UPDATE SET status= true
        RETURNING *`, [habitId, userId, today]);
    
    return rows[0];

};

// getLogsByHabit
const getLogsByHabit = async(habitId, userId)=>{
    const {rows} = await pool.query(
        `SELECT log_date FROM habit_logs
        WHERE habit_id= $1 AND user_id= $2 AND status= true
        ORDER BY log_date DESC`, [habitId, userId]
    );
    return rows;
}
/**This is how we implement idempotency — same request, same result, no error.
 * 
 * What is ON CONFLICT ... DO UPDATE?
This is PostgreSQL's way of handling duplicates gracefully — called an upsert.
try to INSERT
  if unique constraint fires (already logged today)
  instead of erroring → just UPDATE the existing row
Why new Date().toISOString().split('T')[0]?
new Date().toISOString() returns "2026-03-10T14:30:00.000Z"
.split('T')[0] takes everything before the T → "2026-03-10"
That's the format PostgreSQL DATE column expects.
**/

export {createHabit, findAllByUser, findByUser, updateHabit,  deleteHabit, logHabit, getLogsByHabit};