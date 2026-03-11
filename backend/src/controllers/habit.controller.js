import {create, getAll, getOne, update, remove, log, getStreak, getDashboard} from "../services/habit.service.js";

const createHabit = async(req,res, next)=>{
    try{
        const habit = await create(req.user.id, req.body);
        return res.status(201).json({status:'success', data:{habit}});
    }
    catch(err){
        return next(err);
    }
};

const getHabits= async(req,res,next)=>{
    try{
        const habit = await getAll(req.user.id);
        return res.status(200).json({status:'success', data: {habit}});
    }catch (err){
        return next(err);
    }
};

const getHabit= async (req,res,next)=>{
    try{
        const habit = await getOne(req.params.id, req.user.id);
        return res.status(200).json({status:'success', data:{habit}});
    } catch(err){
        return next(err);
    }
};

const updateHabit = async (req,res,next)=>{
    try{
        const habit = await update(req.params.id, req.user.id, req.body);
        return res.status(200).json({status: 'success', data:{habit}});
    } catch (err){
        return next(err);
    }
};

const removeHabit = async(req,res,next)=>{
    try{
        await remove(req.params.id, req.user.id);
        return res.status(200).json({status: 'success', message: 'Habit successfully deleted'});
    } catch (err){
        return next(err);
    }
};

const logHabit = async(req,res, next)=>{
    try{
      
        const entry = await log(req.params.id, req.user.id);
        return res.status(201).json ({status: 'success', data:{entry} });
    }catch (err){
        return next(err);
    }
   
};

const getHabitStreak = async (req, res, next)=>{
    try{
        const data = await getStreak(req.params.id, req.user.id);
        return res.status(200).json ({status:'success', data});
    }catch (err){
        return next(err);
    }
};

const getHabitsStreaks= async(req,res,next)=>{
    try{
        const data = await getDashboard( req.user.id);
        return res.status(200).json ({status:'success', data});
    } catch(err){
        return next(err);
    }
};

export {createHabit, getHabits, getHabit, updateHabit, removeHabit, logHabit, getHabitStreak, getHabitsStreaks };