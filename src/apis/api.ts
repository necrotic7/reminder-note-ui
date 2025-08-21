// src/api.ts
import axios from 'axios';

export const ReminderNoteApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
