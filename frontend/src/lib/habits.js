import api from './api';

export const getHabits = () => api.get('/habits/dashboard');
export const createHabit = (data) => api.post('/habits', data);
export const updateHabit = (id, data) => api.patch(`/habits/${id}`, data);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);
export const completeHabit = (id) => api.post(`/habits/${id}/log`);