import axios from 'axios';

const BASE_URL = 'https://api.green-api.com/waInstance';

export const checkCredentials = async (idInstance, apiTokenInstance) => {
    try {
        const response = await axios.get(
            `${BASE_URL}${idInstance}/getStateInstance/${apiTokenInstance}`
        );
        return response.data.stateInstance === 'authorized';
    } catch (error) {
        return false;
    }
};

export const sendMessage = async (idInstance, apiTokenInstance, phoneNumber, message) => {
    try {
        if (!idInstance || !apiTokenInstance || !phoneNumber || !message) {
            console.error('Отсутствуют обязательные параметры:', { idInstance, apiTokenInstance, phoneNumber, message });
            return false;
        }

        
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
        
        if (cleanPhoneNumber.length < 10) {
            console.error('Неверный формат номера телефона:', cleanPhoneNumber);
            return false;
        }

        const chatId = `${cleanPhoneNumber}@c.us`;
        
        console.log('Отправка сообщения:', {
            url: `${BASE_URL}${idInstance}/sendMessage/${apiTokenInstance}`,
            chatId,
            message
        });

        const response = await axios.post(
            `${BASE_URL}${idInstance}/sendMessage/${apiTokenInstance}`,
            {
                chatId: chatId,
                message: message
            }
        );
        
        console.log('Ответ сервера:', response.data);
        return true;
    } catch (error) {
        console.error('Ошибка отправки сообщения:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            stack: error.stack
        });
        return false;
    }
};

export const receiveNotification = async (idInstance, apiTokenInstance) => {
    try {
        const response = await axios.get(
            `${BASE_URL}${idInstance}/receiveNotification/${apiTokenInstance}`
        );
        
        if (response.data) {
            const receiptId = response.data.receiptId;
     
            try {
                await axios.delete(
                    `${BASE_URL}${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
                );
            } catch (deleteError) {
                console.error('Ошибка удаления уведомления:', deleteError);
                return null; 
            }
            
            const body = response.data.body;
            
            if (
                (body.typeWebhook === 'incomingMessageReceived' || 
                 body.typeWebhook === 'outgoingMessageReceived' ||
                 body.typeWebhook === 'outgoingAPIMessageReceived') && 
                body.messageData?.typeMessage === 'textMessage'
            ) {
                const sender = body.senderData?.sender || body.recipientData?.recipient;
                const messageId = body.idMessage; 
                
                return {
                    id: messageId, 
                    text: body.messageData.textMessageData.textMessage,
                    sender: sender.split('@')[0],
                    timestamp: new Date().toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
            }
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения уведомлений:', error);
        return null;
    }
};

export const getChatHistory = async (idInstance, apiTokenInstance, phoneNumber) => {
    try {
        const response = await axios.post(
            `${BASE_URL}${idInstance}/getChatHistory/${apiTokenInstance}`,
            {
                chatId: `${phoneNumber}@c.us`,
                count: 100
            }
        );
        console.log('История чата:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка получения истории:', error);
        return [];
    }
};
