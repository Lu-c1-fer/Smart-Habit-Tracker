import {
    createHabit,
    findAllByUser,
    findByUser,
    updateHabit,
    deleteHabit,
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

export {create, getAll, getOne, update, remove};


