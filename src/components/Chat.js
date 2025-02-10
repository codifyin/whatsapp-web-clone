import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, receiveNotification } from '../api';

const defaultAvatarUrl = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

const Chat = ({ idInstance, apiTokenInstance }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});  
    const [chats, setChats] = useState([]);  
    const [currentChat, setCurrentChat] = useState(null);
    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCreateChat = () => {
        if (phoneNumber.trim()) {
            const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
            
            if (cleanPhoneNumber.length < 10) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }

            const newChat = {
                id: cleanPhoneNumber,
                name: `+${cleanPhoneNumber}`,
                lastMessage: 'Нет сообщений',
                timestamp: new Date().getTime()
            };
            
            setChats(prevChats => {
                const existingChatIndex = prevChats.findIndex(chat => chat.id === cleanPhoneNumber);
                if (existingChatIndex !== -1) {
                    prevChats.splice(existingChatIndex, 1);
                }
                return [newChat, ...prevChats];
            });
            
            setCurrentChat(newChat);
            if (!messages[cleanPhoneNumber]) {
                setMessages(prev => ({...prev, [cleanPhoneNumber]: []}));
            }
            setShowNewChatDialog(false);
            setPhoneNumber('');
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() && currentChat) {
            console.log('Попытка отправки сообщения:', {
                to: currentChat.id,
                message: message
            });

            const success = await sendMessage(idInstance, apiTokenInstance, currentChat.id, message);
            
            if (success) {
                const newMessage = {
                    id: Date.now(),
                    text: message,
                    sender: 'Вы',
                    timestamp: new Date().toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };

                setMessages(prev => ({
                    ...prev,
                    [currentChat.id]: [...(prev[currentChat.id] || []), newMessage]
                }));

                setChats(prevChats => {
                    const updatedChats = prevChats.filter(chat => chat.id !== currentChat.id);
                    return [{
                        ...currentChat,
                        lastMessage: message,
                        timestamp: Date.now()
                    }, ...updatedChats];
                });

                setMessage('');
                scrollToBottom();
            } else {
                alert('Не удалось отправить сообщение. Пожалуйста, проверьте подключение и попробуйте снова.');
            }
        }
    };

    useEffect(() => {
        const checkNewMessages = async () => {
            try {
                const notification = await receiveNotification(idInstance, apiTokenInstance);
                if (notification) {
                    const senderNumber = notification.sender.replace(/\D/g, '');
                    
                
                    setMessages(prev => {
                        const existingMessages = prev[senderNumber] || [];
                        if (!existingMessages.some(msg => msg.id === notification.id)) {
                            return {
                                ...prev,
                                [senderNumber]: [...existingMessages, {
                                    id: notification.id,
                                    text: notification.text,
                                    sender: 'Собеседник',
                                    timestamp: notification.timestamp
                                }]
                            };
                        }
                        return prev;
                    });

                    setChats(prevChats => {
                        const existingChat = prevChats.find(chat => chat.id === senderNumber);
                        if (!existingChat || existingChat.lastMessage !== notification.text) {
                            const updatedChats = prevChats.filter(chat => chat.id !== senderNumber);
                            const updatedChat = {
                                id: senderNumber,
                                name: `+${senderNumber}`,
                                lastMessage: notification.text,
                                timestamp: Date.now()
                            };
                            return [updatedChat, ...updatedChats];
                        }
                        return prevChats;
                    });

                    scrollToBottom();
                }
            } catch (error) {
                console.error('Ошибка при получении сообщений:', error);
            }
        };

        const interval = setInterval(checkNewMessages, 1000);
        return () => clearInterval(interval);
    }, [idInstance, apiTokenInstance]);

    return (
        <div className="whatsapp-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="user-profile">
                        <img src={defaultAvatarUrl} alt="Profile" className="avatar" />
                    </div>
                    <button className="new-chat-button" onClick={() => setShowNewChatDialog(true)}>
                        Новый чат
                    </button>
                </div>
                <div className="chats-list">
                    {chats.map(chat => (
                        <div 
                            key={chat.id}
                            className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''}`}
                            onClick={() => setCurrentChat(chat)}
                        >
                            <img src={defaultAvatarUrl} alt="Contact" className="chat-avatar" />
                            <div className="chat-info">
                                <div className="chat-name">{chat.name}</div>
                                <div className="chat-last-message">{chat.lastMessage}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-panel">
                {currentChat ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-contact-info">
                                <img src={defaultAvatarUrl} alt="Contact" className="contact-avatar" />
                                <div className="contact-name">{currentChat.name}</div>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {messages[currentChat.id]?.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`message ${msg.sender === 'Вы' ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        <div className="message-text">{msg.text}</div>
                                        <div className="message-time">{msg.timestamp}</div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Введите сообщение"
                            />
                            <button onClick={handleSendMessage} className="send-button">
                                Отправить
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="welcome-screen">
                        <div className="welcome-content">
                            <h1>WhatsApp Web</h1>
                            <p>Нажмите "Новый чат" чтобы начать общение</p>
                        </div>
                    </div>
                )}
            </div>

            {showNewChatDialog && (
                <div className="new-chat-dialog">
                    <div className="dialog-content">
                        <div className="dialog-header">
                            <h3>Новый чат</h3>
                            <button onClick={() => setShowNewChatDialog(false)}>✕</button>
                        </div>
                        <div className="dialog-body">
                            <input
                                type="text"
                                placeholder="Введите номер телефона (например: 79991234567)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <button onClick={handleCreateChat}>Создать чат</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
