import { useEffect, useCallback, useRef, useState } from 'react';
import MessageQueue from '../utils/MessageQueue';
import MessageStore from '../utils/MessageStore';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const useMessagePersistence = (chatId, socket) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedMessages, setQueuedMessages] = useState([]);
  const processingRef = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('App is offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = MessageQueue.subscribe((queue) => {
      setQueuedMessages(queue);
    });

    setQueuedMessages(MessageQueue.getQueue());

    return unsubscribe;
  }, []);

  const loadPersistedMessages = useCallback((chatId) => {
    return MessageStore.getMessages(chatId);
  }, []);

  const persistMessage = useCallback((chatId, message) => {
    return MessageStore.addMessage(chatId, message);
  }, []);

  const persistMessages = useCallback((chatId, messages) => {
    return MessageStore.saveMessages(chatId, messages);
  }, []);

  const queueMessage = useCallback((chatId, message) => {
    const queuedMsg = MessageQueue.addMessage({
      chatId,
      ...message,
    });
    persistMessage(chatId, {
      ...message,
      tempId: queuedMsg.tempId,
      status: 'pending',
    });
    return queuedMsg;
  }, [persistMessage]);

  const processQueue = useCallback(async () => {
    if (processingRef.current || !isOnline) return;

    processingRef.current = true;
    const pendingMessages = MessageQueue.getPendingMessages();

    for (const queuedMsg of pendingMessages) {
      if (queuedMsg.retryCount >= 5) {
        MessageQueue.updateMessageStatus(queuedMsg.tempId, 'failed', null, 'Max retries exceeded');
        continue;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/chatroom/${queuedMsg.chatId}/messages`,
          {
            content: queuedMsg.content,
            tempId: queuedMsg.tempId,
          }
        );

        const serverMessage = response.data.message;
        
        MessageQueue.updateMessageStatus(queuedMsg.tempId, 'sent', serverMessage.id);
        MessageStore.updateMessage(queuedMsg.chatId, queuedMsg.tempId, serverMessage);
        
        setTimeout(() => {
          MessageQueue.removeMessage(queuedMsg.tempId);
        }, 1000);

        if (socket && socket.connected) {
          socket.emit('send-message', {
            chatId: queuedMsg.chatId,
            message: serverMessage,
          });
        }
      } catch (error) {
        console.error('Failed to send queued message:', error);
        MessageQueue.incrementRetryCount(queuedMsg.tempId);
        MessageQueue.updateMessageStatus(
          queuedMsg.tempId,
          'failed',
          null,
          error.message
        );
      }
    }

    processingRef.current = false;
  }, [isOnline, socket]);

  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && queuedMessages.length > 0) {
        processQueue();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline, queuedMessages, processQueue]);

  return {
    isOnline,
    queuedMessages,
    queueMessage,
    loadPersistedMessages,
    persistMessage,
    persistMessages,
    processQueue,
  };
};
