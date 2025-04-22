// src/services/chatbotService.js
import {api} from '../utils/api';

export const sendMessage = async (message) => {
    try {
        const response = await api.post('/chatbot', { message });
        return response.data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};