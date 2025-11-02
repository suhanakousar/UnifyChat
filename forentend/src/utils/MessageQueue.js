class MessageQueue {
  constructor() {
    this.storageKey = 'unifyChat_messageQueue';
    this.listeners = new Set();
  }

  getQueue() {
    try {
      const queue = localStorage.getItem(this.storageKey);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Failed to read message queue:', error);
      return [];
    }
  }

  saveQueue(queue) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save message queue:', error);
    }
  }

  addMessage(message) {
    const queue = this.getQueue();
    const queuedMessage = {
      ...message,
      queuedAt: Date.now(),
      tempId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      retryCount: 0,
    };
    queue.push(queuedMessage);
    this.saveQueue(queue);
    return queuedMessage;
  }

  removeMessage(tempId) {
    const queue = this.getQueue();
    const filteredQueue = queue.filter(msg => msg.tempId !== tempId);
    this.saveQueue(filteredQueue);
  }

  updateMessageStatus(tempId, status, serverId = null, error = null) {
    const queue = this.getQueue();
    const updatedQueue = queue.map(msg => {
      if (msg.tempId === tempId) {
        return {
          ...msg,
          status,
          serverId,
          error,
          lastRetry: Date.now(),
        };
      }
      return msg;
    });
    this.saveQueue(updatedQueue);
  }

  incrementRetryCount(tempId) {
    const queue = this.getQueue();
    const updatedQueue = queue.map(msg => {
      if (msg.tempId === tempId) {
        return {
          ...msg,
          retryCount: (msg.retryCount || 0) + 1,
        };
      }
      return msg;
    });
    this.saveQueue(updatedQueue);
  }

  getPendingMessages() {
    const queue = this.getQueue();
    return queue.filter(msg => msg.status === 'pending' || msg.status === 'failed');
  }

  clearQueue() {
    this.saveQueue([]);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getQueue()));
  }
}

export default new MessageQueue();
