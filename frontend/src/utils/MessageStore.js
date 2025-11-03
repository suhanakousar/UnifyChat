class MessageStore {
  constructor() {
    this.storageKey = 'unifyChat_messages';
    this.metaKey = 'unifyChat_messageMeta';
  }

  getMessages(chatId) {
    try {
      const allMessages = this.getAllMessages();
      return allMessages[chatId] || [];
    } catch (error) {
      console.error('Failed to read messages:', error);
      return [];
    }
  }

  getAllMessages() {
    try {
      const messages = localStorage.getItem(this.storageKey);
      return messages ? JSON.parse(messages) : {};
    } catch (error) {
      console.error('Failed to read all messages:', error);
      return {};
    }
  }

  saveMessages(chatId, messages) {
    try {
      const allMessages = this.getAllMessages();
      allMessages[chatId] = messages;
      localStorage.setItem(this.storageKey, JSON.stringify(allMessages));
      this.updateMeta(chatId, messages);
      return true;
    } catch (error) {
      console.error('Failed to save messages:', error);
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
        try {
          const allMessages = this.getAllMessages();
          allMessages[chatId] = messages;
          localStorage.setItem(this.storageKey, JSON.stringify(allMessages));
          return true;
        } catch (retryError) {
          console.error('Failed to save messages after cleanup:', retryError);
          return false;
        }
      }
      return false;
    }
  }

  addMessage(chatId, message) {
    const messages = this.getMessages(chatId);
    const isDuplicate = messages.some(
      msg => msg.id === message.id || msg.tempId === message.tempId
    );
    
    if (!isDuplicate) {
      messages.push(message);
      messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      return this.saveMessages(chatId, messages);
    }
    return true;
  }

  updateMessage(chatId, tempId, serverMessage) {
    const messages = this.getMessages(chatId);
    const index = messages.findIndex(msg => msg.tempId === tempId);
    
    if (index !== -1) {
      messages[index] = {
        ...messages[index],
        ...serverMessage,
        tempId: tempId,
      };
      return this.saveMessages(chatId, messages);
    }
    return false;
  }

  deleteMessage(chatId, messageId) {
    const messages = this.getMessages(chatId);
    const filteredMessages = messages.filter(msg => msg.id !== messageId && msg.tempId !== messageId);
    return this.saveMessages(chatId, filteredMessages);
  }

  clearChat(chatId) {
    const allMessages = this.getAllMessages();
    delete allMessages[chatId];
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(allMessages));
      return true;
    } catch (error) {
      console.error('Failed to clear chat:', error);
      return false;
    }
  }

  updateMeta(chatId, messages) {
    try {
      const meta = this.getMeta();
      meta[chatId] = {
        lastMessage: messages.length > 0 ? messages[messages.length - 1] : null,
        messageCount: messages.length,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(this.metaKey, JSON.stringify(meta));
    } catch (error) {
      console.error('Failed to update meta:', error);
    }
  }

  getMeta() {
    try {
      const meta = localStorage.getItem(this.metaKey);
      return meta ? JSON.parse(meta) : {};
    } catch (error) {
      console.error('Failed to read meta:', error);
      return {};
    }
  }

  cleanup() {
    console.log('Running message store cleanup...');
    const allMessages = this.getAllMessages();
    const meta = this.getMeta();
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    
    Object.keys(allMessages).forEach(chatId => {
      const chatMeta = meta[chatId];
      if (chatMeta && now - chatMeta.lastUpdated > maxAge) {
        delete allMessages[chatId];
        delete meta[chatId];
      } else if (allMessages[chatId].length > 1000) {
        allMessages[chatId] = allMessages[chatId].slice(-1000);
      }
    });

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(allMessages));
      localStorage.setItem(this.metaKey, JSON.stringify(meta));
      console.log('Cleanup completed successfully');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
}

export default new MessageStore();
