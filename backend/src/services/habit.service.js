import {
    createHabit,
    findAllByUser,
    findByUser,
    updateHabit,
    deleteHabit,
    logHabit,
    getLogsByHabit
} from "../repositories/habit.repo.js"

const create= async(userId, habitData)=>{
    return await createHabit ({userId, ...habitData}); // whats happening here

};

const getAll = async(userId)=>{
    const habit = await findAllByUser(userId);

    if(!habit){
        const error = new Error("Habits not found. Please create one")
        error.statusCode = 404;
        throw error;
    }
    return habit;
};

const getOne= async(id, userId)=>{
     
    const habit= await findByUser(id, userId);
     

    if(!habit){
        const error = new Error('Habit not found');
        error.statusCode = 404;
        throw error;
    }
    return habit;
};

const update = async(id, userId, updates)=> {
    const habit = await updateHabit(id, userId, updates);
    if(!habit){
        const error = new Error('Habit not found')
        error.statuscode = 404;
        throw error;
    }
    return habit;
} ;

const remove = async(id, userId)=>{    // why delete as variable could not be used
    const habit = await deleteHabit(id,userId);

    if(!habit){
        const error = new Error('Habit not found')
        error.statusCode = 404;
        throw error;
    }
    return habit;
};

const log = async(habitId, userId)=>{
    //first verify if the habit belongs to the user
   
    await getOne(habitId, userId);
    return await logHabit(habitId, userId);
};

const calculateStreak = (logs) =>{
    if (logs.length===0) return 0;

    //maps all the dates in logs and splits from T and keeps only dates

    const loggedDates = new Set(logs.map(log => new Date(log.log_date).toISOString().split('T')[0]));

   // format any date to string,split and keep the original date

   const dateStr= (date)=>date.toISOString().split('T')[0];

   const today= new Date();
   today.setHours(0,0,0,0); 
// primitive datatypes are immutable while non-primitves are mutable as they are stored by reference so any change in these datatypes point to same object

   const yesterday = new Date(today);
   yesterday.setDate(today.getDate()-1); // todays date -1 day

// grace period start from today or yesterday
let current;
if (loggedDates.has(dateStr(today))){
    current = today;  //today is logged - start from today
} else if (loggedDates.has(dateStr(yesterday))){
    current = yesterday; // if not logged today yet but was logged yesterday - start from tody
}else{
    return 0;
}

// walk from backwards 
let streak = 0
while (true){
    if (loggedDates.has(dateStr(current))){
        streak++;
        current.setDate(current.getDate()-1);
    }
    else {
        break;
    }
}
return streak;

};

//get streak for one habit
const getStreak = async (habitId, userId)=>{
    const habit= await getOne(habitId, userId); //check if the habit belongs to the user
    const logs = await getLogsByHabit(habitId, userId); // get the habitslogs date from the repo habit_log table
    const streak = calculateStreak(logs); //calculate streak of the habit by checkign the logged dates
    return{habit, streak, totalLogs: logs.length}; // return habit, its streak and the streak count
};

//get streak for all the habits user have
const getDashboard = async (userId)=>{
    const habits = await findAllByUser(userId); // gets all the habits user has

    const habitsWithStreaks = await Promise.all( // all the habits are simultaneously processed, all the habits streak are calculated at same time
        habits.map(async(habit)=>{    // will go through all the habits
            const logs = await getLogsByHabit(habit.id, userId); // will go to that specific habit takes its id and user id and willl get habit logs date from the habit log table
            const streak = calculateStreak(logs); // will calculate that specific habits streak
            return {...habit, streak, totalLogs: logs.length};// will create an object and keeps on passing the previous habit and its streak and continue with another hait until map goes through all the habits
        })
    );
    return {
        totalHabits: habits.length, // toatal number of habits
        habits: habitsWithStreaks, // all the habits with their respective streak and logs length
    };

};

export {create, getAll, getOne, update, remove,log, getStreak, getDashboard};


