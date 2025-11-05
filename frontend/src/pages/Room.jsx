// Room.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../components/chatroom/Sidebar.jsx";
import ChatWindow from "../components/chatroom/ChatWindow.jsx";
import ChatInfo from "../components/chatroom/ChatInfo.jsx";
import NavBar from "../components/NavBar.jsx";
import { FaTimes, FaWifi } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { showToastError, showToastSuccess } from "../components/common/ShowToast";
import RequestJoin from "../components/chatroom/RequestJoin.jsx";
import WaitingApproval from "../components/chatroom/WaitingApproval.jsx";
import UserProfileModal from "../components/chatroom/UserProfileModal.jsx";
import JoinViaLinkModal from "../components/chatroom/JoinViaLinkModal.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import api from "../config/api";
import { useMessagePersistence } from "../hooks/useMessagePersistence";
import { useAuth } from "../context/authContext";

import debounce from 'lodash/debounce';

const ChatRoom = () => {
  const EmptyState = () => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 dark:bg-brand-grey-dark transition-colors">
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-yellow/10 dark:bg-brand-yellow-light/10 flex items-center justify-center">
            <span className="text-5xl">💬</span>
          </div>
          <h2 className="text-3xl font-bold text-brand-grey-dark dark:text-brand-white mb-3 font-['Montserrat']">
            Welcome to Chat!
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-['Inter'] text-lg">
            Select a conversation from the sidebar or start a new one to begin chatting
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="bg-brand-yellow dark:bg-brand-yellow-light hover:bg-brand-yellow-light dark:hover:bg-brand-yellow text-brand-grey-dark px-6 py-3 rounded-xl font-semibold font-['Montserrat'] transition-all shadow-md hover:shadow-lg hover:scale-105"
              onClick={() => setIsNewChatModalOpen(true)}
            >
              Start New Chat
            </button>
            <button
              className="bg-white dark:bg-brand-grey-medium border-2 border-brand-yellow dark:border-brand-yellow-light hover:bg-brand-yellow/10 dark:hover:bg-brand-yellow/10 text-brand-grey-dark dark:text-brand-white px-6 py-3 rounded-xl font-semibold font-['Montserrat'] transition-all shadow-md hover:shadow-lg hover:scale-105"
              onClick={() => setShowJoinViaLinkModal(true)}
            >
              Join via Link
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NewChatModal = ({ isOpen, onClose, onCreateChat }) => {
    const [chatName, setChatName] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!chatName.trim()) return;

      onCreateChat({
        name: chatName,
        description: description,
      });

      setChatName("");
      setDescription("");
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-brand-grey-medium rounded-2xl w-full max-w-md mx-4 shadow-xl border border-neutral-200 dark:border-brand-grey-light">
          <div className="font-['Inter'] p-6 border-b border-neutral-200 dark:border-brand-grey-light flex justify-between items-center relative">
            <h2 className="text-xl font-bold text-brand-grey-dark dark:text-brand-white font-['Montserrat']">New Chat</h2>
            <button
              onClick={onClose}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="font-['Inter'] text-brand-grey-dark dark:text-brand-white block text-sm font-semibold mb-2">
                Chat Name
              </label>
              <input
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                className="placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-brand-grey-light rounded-xl w-full py-3 px-4 bg-white dark:bg-brand-grey-light text-brand-grey-dark dark:text-brand-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light transition-colors"
                placeholder="Enter chat name"
                required
              />
            </div>

            <div className="mb-6">
              <label className="font-['Inter'] text-brand-grey-dark dark:text-brand-white block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-brand-grey-light rounded-xl w-full py-3 px-4 bg-white dark:bg-brand-grey-light text-brand-grey-dark dark:text-brand-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light transition-colors resize-none"
                placeholder="Enter a description (optional)"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="font-['Inter'] font-semibold bg-neutral-100 dark:bg-brand-grey-light hover:bg-neutral-200 dark:hover:bg-brand-grey-medium text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-xl transition-colors border border-neutral-200 dark:border-brand-grey-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="font-['Inter'] font-semibold bg-brand-yellow dark:bg-brand-yellow-light hover:bg-brand-yellow-light dark:hover:bg-brand-yellow text-brand-grey-dark px-4 py-2 rounded-xl shadow-md transition-all"
              >
                Create Chat
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get userId from user object first, fallback to localStorage
  const userId = user?.id || localStorage.getItem("user_id");

  // Instead of a single [messages], we store a dictionary: { [roomId]: [msg, msg, ...], ... }
  const [roomMessages, setRoomMessages] = useState({});
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(urlChatId);
  const [lastScrollChatId, setLastScrollChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // UI states
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isPrepending, setIsPrepending] = useState(false);
  const [messagePagination, setMessagePagination] = useState({}); // { [chatId]: { cursor, hasMore } }

  const [showJoinRequest, setShowJoinRequest] = useState(false);
  const [showWaitingApproval, setShowWaitingApproval] = useState(false);
  const [invitedChatDetails, setInvitedChatDetails] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [chatAdmins, setChatAdmins] = useState({}); // { [chatId]: adminId }
  const [showJoinViaLinkModal, setShowJoinViaLinkModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);

  const messageContainerRef = useRef(null);

  // Add loading state for room transitions
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const membershipControllerRef = useRef(null);

  const checkMembership = useCallback(async (chatId) => {
    if (!chatId) return;

    // Cancel previous request
    if (membershipControllerRef.current) {
      membershipControllerRef.current.abort();
    }

    membershipControllerRef.current = new AbortController();
    const { signal } = membershipControllerRef.current;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/chatroom/${chatId}/isMember/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal // Pass the AbortController signal
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, or parsing fails
        const error = new Error('Failed to parse response from server');
        error.response = { status: response.status, data: { message: 'Invalid server response' } };
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Failed to fetch membership status');
        error.response = { status: response.status, data: data };
        throw error;
      }

      // Check membership status
      if (data.isMember) {
        // User is a member, load the chat
        setCurrentChatId(chatId);
      } else if (data.status === 'pending') {
        const chatroom = data.chatroom;

        if (chatroom) {
          const invitedChat = {
            id: chatId,
            name: chatroom.name || "Unknown Chat",
            avatarColor: chatroom.avatar_color,
            avatarText: chatroom.avatar_text,
            lastMessage: chatroom.last_message || "",
            time: new Date(),
            unread: true,
            messages: [],
            status: "pending",
          };

          setInvitedChatDetails(invitedChat);
          setShowWaitingApproval(true);
        } else {
          showToastError("Chat room information not available");
          navigate("/Chat");
        }
      } else {
        const chatroom = data.chatroom;

        if (chatroom) {
          const invitedChat = {
            id: chatId,
            name: chatroom.name || "Unknown Chat",
            avatarColor: chatroom.avatar_color,
            avatarText: chatroom.avatar_text,
            lastMessage: chatroom.last_message || "",
            time: new Date(),
            unread: true,
            messages: [],
            status: "invited",
          };

          setInvitedChatDetails(invitedChat);
          setShowJoinRequest(true);
        } else {
          showToastError("Chat room information not available");
          navigate("/Chat");
        }
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        // Request was canceled, ignore
        return;
      }
      if (err.response?.status === 404) {
        showToastError("Chat room not found");
        navigate("/Chat");
      } else if (err.response?.status === 403) {
        showToastError("You are not a member of this chat room");
        navigate("/Chat");
      } else {
        // Handle null chatroom or malformed response
        showToastError("Failed to check membership");
        navigate("/Chat");
      }
    } finally {
      membershipControllerRef.current = null;
    }
  }, [userId, navigate]);

  useEffect(() => {
    checkMembership(currentChatId);
  }, [currentChatId, checkMembership]);

  // Single socket
  const [socket, setSocket] = useState(null);
  
  const {
    isOnline,
    persistMessages,
    loadPersistedMessages,
  } = useMessagePersistence(currentChatId, socket);

  useEffect(() => {
    if (currentChatId) {
      const persisted = loadPersistedMessages(currentChatId);
      if (persisted && persisted.length > 0 && !roomMessages[currentChatId]) {
        setRoomMessages(prev => ({
          ...prev,
          [currentChatId]: persisted
        }));
      }
    }
  }, [currentChatId, loadPersistedMessages]);

  useEffect(() => {
    if (currentChatId && roomMessages[currentChatId]) {
      persistMessages(currentChatId, roomMessages[currentChatId]);
    }
  }, [roomMessages, currentChatId, persistMessages]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (currentChatId && !roomMessages[currentChatId] && currentChat && currentChat.status !== "pending") {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/chatroom/${currentChatId}/messages`,
            {
              params: {
                cursor: null,
              },
            }
          );

          setRoomMessages((prev) => ({
            ...prev,
            [currentChatId]: res.data.messages
              .filter((message) => message.chat_id === currentChatId)
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
          }));

          setMessagePagination((prev) => ({
            ...prev,
            [currentChatId]: {
              cursor: res.data.cursor,
              hasMore: res.data.hasMore,
            },
          }));

        } catch (err) {
          if (err.response?.status === 404) {
            showToastError("Chat room not found");
          } else if (err.response?.status === 403) {
            showToastError("You are not a member of this chat room");
          } else {
            showToastError("Failed to load messages");
          }
        }
      }
    };

    loadInitialMessages();
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [currentChatId]);

  useEffect(() => {
    const socketInstance = io(`${API_BASE_URL}`, {
      transports: ["websocket"],
      auth: { userId: userId },
      withCredentials: true, // Send cookies with socket connection
    });

    console.log("Attempting Socket.IO connection with userId:", userId); // Add this line

    socketInstance.on("connect", () => {
      // Join current room if exists
      if (urlChatId) {
        socketInstance.emit("joinRoom", urlChatId);
      }
    });

    socketInstance.on("connect_error", (error) => {
      showToastError("Failed to connect to chat server");
    });

    socketInstance.on("disconnect", (reason) => {
    });

    socketInstance.on("join-request-handled", (data) => {
      if (data.userId === userId) {
        if (data.action === 'approved') {
          showToastSuccess("Your join request has been approved!");
          // Refresh chats
          fetchChats();
          // Navigate to the chat
          navigate(`/Chat/${data.chatId}`);
        } else {
          showToastError("Your join request has been rejected.");
        }
      }
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, [userId, urlChatId, navigate]);

  useEffect(() => {
    if (!socket || !currentChatId) return;
      const handleReceiveMessage = (incomingMessage) => {
        if (incomingMessage.chat_id === currentChatId || incomingMessage.chatId === currentChatId) {
          setRoomMessages((prev) => {
            const existing = prev[currentChatId] || [];
            const messageExists = existing.some(msg => msg.id === incomingMessage.id);
            if (messageExists) {
              return prev;
            }
            return {
              ...prev,
              [currentChatId]: [
                ...existing,
                { ...incomingMessage, fromUser: false },
              ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
            };
          });
        }
    };
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, currentChatId]);

  // For the currently selected chat, we show that chat's messages or an empty array
  const currentChatMessages = roomMessages[currentChatId] || [];
  const currentChat = chats.find((c) => c.id === currentChatId) || null;

  // 1. Load all chats for the sidebar (no GET for messages, just for chats)
  const fetchChats = async () => {
    try {
      const allChats = await axios.get(
        `${API_BASE_URL}/chatroom/user/${userId}`
      );
      const newChats =
        allChats.data?.chatRooms.map((chat) => chat.chatRoom) || [];

      // Store admin IDs for each chat
      const adminMap = {};
      newChats.forEach((chat) => {
        adminMap[chat.id] = chat.admin_id;
      });
      setChatAdmins(adminMap);

      // Mark unread
      const statuses = await Promise.all(
        newChats.map((chat) =>
          axios.get(
            `${API_BASE_URL}/chatroom/${chat.id}/readStatus/${userId}`
          )
        )
      );

      newChats.forEach((chat, index) => {
        chat.unread = statuses[index].data.unread;
      });

      setChats(newChats);

      // Set currentChatId based on urlChatId if valid, else first chat or null
      if (urlChatId && newChats.some(chat => chat.id === urlChatId)) {
        setCurrentChatId(urlChatId);
      } else if (urlChatId) {
        // If urlChatId is specified, set it even if not in chats (for invite)
        setCurrentChatId(urlChatId);
      } else if (newChats.length > 0) {
        setCurrentChatId(newChats[0].id);
      } else {
        setCurrentChatId(null);
      }
    } catch (err) {
      showToastError(err.response?.data?.message || "Failed to load chats");
      setCurrentChatId(null);
    }
  };

  useEffect(() => {
    // Only fetch chats if userId is available
    if (userId) {
      fetchChats();
    } else {
      // If no userId, show error or redirect
      console.warn("No userId available, cannot fetch chats");
      showToastError("Please log in to view your chats");
    }
  }, [userId, urlChatId, navigate]);

  // 2. Filter chats for sidebar

  const [filteredChats, setFilteredChats] = useState(chats);
  useEffect(() => {
    let filtered = [...chats];

    if (searchTerm) {
      filtered = filtered.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter === "unread") {
      filtered = filtered.filter((chat) => chat.unread);
    }

    setFilteredChats(filtered);
  }, [chats, activeFilter, searchTerm]);

  const handleSendMessage = async (replyToMessage = null) => {
    if (!newMessage.trim() || !currentChatId) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/rooms/${currentChatId}/messages`,
        { text: newMessage, userId: userId, replyToId: replyToMessage?.id }
      );
      const savedMessage = response.data;
      savedMessage.fromUser = true;
      if (!savedMessage.created_at) {
        savedMessage.created_at = new Date();
      }
      if (replyToMessage) {
        savedMessage.replyTo = replyToMessage;
      }

      setRoomMessages((prev) => {
        const existingArray = prev[currentChatId] || [];
        const messageExists = existingArray.some(msg => msg.id === savedMessage.id);
        if (messageExists) {
          return prev;
        }
        return {
          ...prev,
          [currentChatId]: [...existingArray, savedMessage].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          ),
        };
      });

      const messageToSend = {
        id: savedMessage.id,
        content: savedMessage.content,
        created_by: savedMessage.created_by || userId,
        chat_id: currentChatId,
        chatId: currentChatId,
        created_at: savedMessage.created_at || new Date(),
        sender: savedMessage.sender || {
          id: userId,
          given_name: "User",
          profile_picture: null,
        },
        replyTo: replyToMessage || null,
      };

      if (socket) {
        socket.emit("send-message", messageToSend, currentChatId);
      }

      setNewMessage("");
      if (replyToMessage) {
        setReplyingTo(null);
      }

      const updated = chats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, lastMessage: `You: ${newMessage}`, time: "now" }
          : chat
      );
      setChats(updated);
    } catch (error) {
      if (error.response?.status === 404) {
        showToastError("Chat room not found");
      } else if (error.response?.status === 403) {
        showToastError("You are not a member of this chat room");
      } else {
        showToastError(error.response?.data?.error || "Error sending message");
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!currentChatId) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await axios.post(`${API_BASE_URL}/chatroom/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { fileUrl, fileType, originalName } = uploadResponse.data;

      // Send message with file URL
      const response = await axios.post(
        `${API_BASE_URL}/rooms/${currentChatId}/messages`,
        {
          text: fileType === 'image' ? `Image: ${originalName}` : `File: ${originalName}`,
          userId: userId,
          file_url: fileUrl,
          file_type: fileType
        }
      );

      const savedMessage = response.data;
      savedMessage.fromUser = true;
      savedMessage.created_at = new Date();

      setRoomMessages((prev) => {
        const existingArray = prev[currentChatId] || [];
        return {
          ...prev,
          [currentChatId]: [...existingArray, savedMessage].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          ),
        };
      });

      const messageToSend = {
        content: savedMessage.content,
        sender: userId || "Unknown",
        senderColor: savedMessage.senderColor || "#ccc",
        created_at: new Date(),
        file_url: fileUrl,
        file_type: fileType,
      };

      if (socket) {
        socket.emit("send-message", messageToSend, currentChatId);
      }

      const updated = chats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, lastMessage: `You: ${fileType === 'image' ? 'Image' : 'File'}`, time: "now" }
          : chat
      );
      setChats(updated);
    } catch (error) {
      showToastError(error.response?.data?.error || "Error uploading file");
    }
  };

  // Handle image upload (similar to file upload)
  const handleImageUpload = async (file) => {
    await handleFileUpload(file);
  };

  // 5. Create a new chat => POST to the server (no GET for messages)
  const handleCreateChat = async (chatData) => {
    const data = {
      name: chatData.name,
      description: chatData.description || "",
      adminId: userId,
      avatarColor: `bg-${
        ["green", "purple", "cyan", "yellow", "blue"][
          Math.floor(Math.random() * 5)
        ]
      }-400`,
      avatarText: chatData.name.charAt(0).toUpperCase(),
      lastMessage: "Start a conversation...",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/chatroom`, data);
      if (response.status === 201) {
        const newChat = response.data?.chatroom;
        newChat.unread = true;
        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        navigate(`/Chat/${newChat.id}`);

        // Optionally join the new room
        if (socket) {
          socket.emit("joinRoom", newChat.id);
        }

        // Start with an empty array for the new chat
        setRoomMessages((prev) => ({
          ...prev,
          [newChat.id]: [],
        }));
      }
    } catch (err) {
      showToastError(err.response?.data?.message);
    }

    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  // 6. Auto-scroll
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    // Check if it's a new chat or initial load
    const isNewChatOrInitialLoad =
      currentChatMessages.length > 0 &&
      (!lastScrollChatId || lastScrollChatId !== currentChatId);

    // Only auto-scroll if we're already near the bottom or it's a new chat
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if ((isNearBottom || isNewChatOrInitialLoad) && !isPrepending) {
      container.scrollTop = container.scrollHeight;
    }
  }, [currentChatMessages, isPrepending, currentChatId, lastScrollChatId]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      // Scroll to the very bottom
      container.scrollTop = container.scrollHeight;
    }
  }, [currentChatId]);

  // Debounced room switch to prevent rapid toggling
  const debouncedLoadRoom = useCallback(
    debounce(async (chatId) => {
      setIsLoadingRoom(true);
      try {
        // Mark as read
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId && chat.unread ? { ...chat, unread: false } : chat
          )
        );

        await api.put(`/chatroom/${chatId}/readStatus/${userId}`);

        // Fetch initial messages (if not already loaded)
        if (!roomMessages[chatId]) {
          const res = await api.get(`/chatroom/${chatId}/messages`, {
            params: { cursor: null },
          });

          setRoomMessages((prev) => ({
            ...prev,
            [chatId]: res.data.messages
              .filter((message) => message.chat_id === chatId)
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
          }));

          setMessagePagination((prev) => ({
            ...prev,
            [chatId]: {
              cursor: res.data.cursor,
              hasMore: res.data.hasMore,
            },
          }));
        }

        const container = messageContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight - container.clientHeight;
        }
      } catch (err) {
        if (err.response?.status === 404) {
          showToastError("Chat room not found");
        } else if (err.response?.status === 403) {
          showToastError("You are not a member of this chat room");
        } else {
          showToastError("Failed to load messages");
        }
      } finally {
        setIsLoadingRoom(false);
      }
    }, 200),
    [userId, roomMessages]
  );

  // 7. Handle selecting a chat
  const handleChatClick = useCallback(async (chatId) => {
    if (isLoadingRoom) return; // Prevent switching during load

    setLastScrollChatId(currentChatId);
    setCurrentChatId(chatId);
    navigate(`/Chat/${chatId}`);

    // Join the room via socket
    if (socket) {
      socket.emit("joinRoom", chatId);
    }

    // On mobile, hide sidebar after selecting
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }

    // Load room data with debouncing
    debouncedLoadRoom(chatId);
  }, [currentChatId, navigate, socket, isLoadingRoom, debouncedLoadRoom]);

  // 8. Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowChatInfo(false);
        if (currentChatId && showSidebar) {
          setShowSidebar(false);
        }
      } else if (window.innerWidth < 1024) {
        setShowChatInfo(false);
        setShowSidebar(true);
      } else {
        setShowSidebar(true);
        setShowChatInfo(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentChatId]);

  // 9. Toggles
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleChatInfo = () => setShowChatInfo(!showChatInfo);

  // 10. Lazy loading for messages

  const loadMoreMessages = async (chatId) => {
    const container = messageContainerRef.current;
    const initialScrollHeight = container.scrollHeight;
    const initialScrollTop = container.scrollTop;

    if (chatId !== lastScrollChatId) {
      setLastScrollChatId(currentChatId);
      return;
    }

    const { cursor, hasMore } = messagePagination[chatId] || {};

    if (hasMore === false) return;

    setIsPrepending(true);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/chatroom/${chatId}/messages`,
        {
          params: { cursor },
        }
      );

      const newMessages = res.data.messages.filter(
        (message) => message.chat_id === chatId
      );
      // .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      setRoomMessages((prev) => {
        const current = prev[chatId] || [];
        const combinedMessages = [...newMessages, ...current]
          .filter(
            (msg, index, self) =>
              index === self.findIndex((m) => m.id === msg.id)
          )
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        return {
          ...prev,
          [chatId]: combinedMessages,
        };
      });

      setMessagePagination((prev) => ({
        ...prev,
        [chatId]: {
          cursor: res.data.cursor,
          hasMore: res.data.hasMore,
        },
      }));

      requestAnimationFrame(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop =
            newScrollHeight - initialScrollHeight + initialScrollTop;
        }
      });
    } catch (err) {
      if (err.response?.status === 404) {
        showToastError("Chat room not found");
      } else if (err.response?.status === 403) {
        showToastError("You are not a member of this chat room");
      } else {
        showToastError("Failed to load older messages");
      }
    } finally {
      // Reset prepending state
      setIsPrepending(false);
    }
  };

  // const loadMoreMessages = async (chatId) => {
  //   if (chatId !== currentChatId) {
  //     return;
  //   }

  //   const { cursor, hasMore } = messagePagination[chatId] || {};
  //   if (hasMore === false) return;

  //   setIsPrepending(true);

  //   try {
  //     const res = await axios.get(
  //       `${API_BASE_URL}/chatroom/${chatId}/messages`,
  //       {
  //         params: { cursor },
  //       }
  //     );

  //     const newMessages = res.data.messages;

  //     // setRoomMessages((prev) => ({
  //     //   ...prev,
  //     //   [chatId]: res.data.messages.filter(
  //     //     (message) => message.chat_id === chatId
  const handleJoinRequest = async (userName) => {
    const requestedId = invitedChatDetails.id;

    // update in backend
    try {
      await axios.post(
        `${API_BASE_URL}/chatroom/${requestedId}/request`,
        {
          userId: userId,
        }
      );
      showToastSuccess("Join request sent successfully");
    } catch (err) {
      showToastError("Failed to send join request");
      return;
    }

    setShowJoinRequest(false);
    setShowWaitingApproval(true);
  };

  // 12. Handle cancel join request
  const handleCancelJoinRequest = () => {
    setShowJoinRequest(false);

    if (chats.length > 0) {
      setCurrentChatId(chats[0].id);
    } else {
      setCurrentChatId(null);
    }
  };

  // 13. Handle back to chats
  const handleBackToChats = () => {
    setCurrentChatId(chats[0]?.id || null);
    navigate("/Chat");
  };

  // 13.5. Handle join via invite link
  const handleJoinViaLink = async (chatId) => {
    try {
      // Check if user is already a member
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/chatroom/${chatId}/isMember/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let membershipCheckData;
      try {
        membershipCheckData = await response.json();
      } catch (jsonError) {
        const error = new Error('Failed to parse response from server');
        error.response = { status: response.status, data: { message: 'Invalid server response' } };
        throw error;
      }

      if (!response.ok) {
        const error = new Error(membershipCheckData.message || 'Failed to fetch membership status');
        error.response = { status: response.status, data: membershipCheckData };
        throw error;
      }

      // Check if user is already a member
      if (membershipCheckData.isMember) {
        // User is already a member, redirect to chat
        showToastSuccess("You're already a member of this chat");
        setCurrentChatId(chatId);
        navigate(`/Chat/${chatId}`);
        setShowJoinViaLinkModal(false);
        return;
      }

      if (membershipCheckData.status === 'pending') {
        // Already requested, show waiting approval
        showToastError("You already have a pending request for this chat");
        const chatroom = membershipCheckData.chatroom;
        if (chatroom) {
          const invitedChat = {
            id: chatId,
            name: chatroom.name || "Unknown Chat",
            avatarColor: chatroom.avatar_color,
            avatarText: chatroom.avatar_text,
            lastMessage: chatroom.last_message || "",
            time: new Date(),
            unread: true,
            messages: [],
            status: "pending",
          };
          setInvitedChatDetails(invitedChat);
          setShowWaitingApproval(true);
          setShowJoinViaLinkModal(false);
          navigate("/Chat");
        }
        return;
      }

      // Send join request
      await api.post(
        `/chatroom/${chatId}/request`,
        { userId: userId }
      );

      // Get chatroom details
      const chatroom = membershipCheck.data.chatroom;
      if (chatroom) {
        const invitedChat = {
          id: chatId,
          name: chatroom.name || "Unknown Chat",
          avatarColor: chatroom.avatar_color,
          avatarText: chatroom.avatar_text,
          lastMessage: chatroom.last_message || "",
          time: new Date(),
          unread: true,
          messages: [],
          status: "invited",
        };

        setInvitedChatDetails(invitedChat);
        showToastSuccess("Join request sent successfully");
        setShowJoinRequest(true);
        setShowJoinViaLinkModal(false);
        navigate("/Chat");
      } else {
        showToastError("Chat room not found");
        setShowJoinViaLinkModal(false);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        showToastError("Chat room not found. Please check the invite link.");
      } else if (err.response?.status === 403) {
        showToastError("Access denied to this chat room");
      } else {
        showToastError(err.response?.data?.error || "Failed to join chatroom");
      }
      throw err;
    }
  };

  const handleEditMessage = async (message, newContent) => {
    if (!message || !message.id) {
      showToastError("Invalid message");
      return;
    }

    try {
      const response = await api.put(
        `/messages/${message.id}`,
        { content: newContent, userId: userId }
      );

      const updatedMessage = response.data;
      updatedMessage.fromUser = message.created_by === userId;

      // Update the message in state
      setRoomMessages((prev) => {
        const existingArray = prev[currentChatId] || [];
        return {
          ...prev,
          [currentChatId]: existingArray.map((msg) =>
            msg.id === message.id ? { ...msg, ...updatedMessage } : msg
          ),
        };
      });

      // Emit socket event to update for other users
      if (socket) {
        socket.emit("send-message", {
          ...updatedMessage,
          chat_id: currentChatId,
          chatId: currentChatId,
          isEdit: true,
        }, currentChatId);
      }

      showToastSuccess("Message edited successfully");
    } catch (err) {
      if (err.response?.status === 403) {
        showToastError("You can only edit your own messages");
      } else {
        showToastError(err.response?.data?.error || "Failed to edit message");
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) {
      showToastError("Invalid message");
      return;
    }

    try {
      await api.delete(`/messages/${messageId}`, {
        data: { userId: userId }
      });

      // Remove the message from state
      setRoomMessages((prev) => {
        const existingArray = prev[currentChatId] || [];
        return {
          ...prev,
          [currentChatId]: existingArray.filter((msg) => msg.id !== messageId),
        };
      });

      // Emit socket event to delete for other users
      if (socket) {
        socket.emit("delete-message", {
          messageId: messageId,
          chatId: currentChatId,
        });
      }

      showToastSuccess("Message deleted successfully");
    } catch (err) {
      if (err.response?.status === 403) {
        showToastError("You can only delete your own messages");
      } else {
        showToastError(err.response?.data?.error || "Failed to delete message");
      }
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const onBackToHome = () => navigate('/');


  const handleDeleteChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/chatroom/${chatToDelete.id}`, {
        data: { userId: userId }
      });
      setChats((prev) => prev.filter((chat) => chat.id !== chatToDelete.id));
      if (currentChatId === chatToDelete.id) {
        const remainingChats = chats.filter((chat) => chat.id !== chatToDelete.id);
        if (remainingChats.length > 0) {
          setCurrentChatId(remainingChats[0].id);
          navigate(`/Chat/${remainingChats[0].id}`);
        } else {
          setCurrentChatId(null);
          navigate("/Chat");
        }
      }
      setShowDeleteModal(false);
      setChatToDelete(null);
      showToastSuccess("Chat deleted successfully");
    } catch (err) {
      showToastError("Failed to delete chat");
      setShowDeleteModal(false);
      setChatToDelete(null);
    }
  };

  const renderMainContent = () => {
    if (!currentChatId || !urlChatId) {
      return <EmptyState />;
    }

    if (currentChat?.status === "pending") {
      return <WaitingApproval chatName={currentChat.name} />;
    }

    if (isLoadingRoom) {
      return (
        <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-brand-grey-dark">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading room...</p>
          </div>
        </div>
      );
    }

    return (
      <ChatWindow
        // messages={currentChat?.messages || []}
        messages={roomMessages[currentChatId] || []}
        // isTyping={isTyping}
        currentChat={currentChat}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        messageContainerRef={messageContainerRef}
        toggleSidebar={toggleSidebar}
        toggleChatInfo={toggleChatInfo}
        showSidebar={showSidebar}
        showChatInfo={showChatInfo}
        onLoadMoreMessages={loadMoreMessages}
        currentUserId={userId}
        onFileUpload={handleFileUpload}
        onImageUpload={handleImageUpload}
        isOnline={isOnline}
        onBack={() => {
          setCurrentChatId(null);
          navigate('/Chat');
        }}
        onUserClick={(userId) => {
          setSelectedUserId(userId);
          setShowProfileModal(true);
        }}
        socket={socket}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />
    );
  };

  if (showWaitingApproval && invitedChatDetails) {
    return (
      <div className="flex flex-col h-screen bg-neutral-50 dark:bg-brand-grey-dark transition-colors">
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && (
          <Sidebar
            chats={filteredChats}
            originalChats={chats}
            setOriginalChats={setChats}
            currentChatId={currentChatId}
            onChatClick={handleChatClick}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onNewChat={() => setIsNewChatModalOpen(true)}
            onBackToChats={handleBackToChats}
            onBackToHome={onBackToHome}
            onJoinViaLink={() => setShowJoinViaLinkModal(true)}
            onDeleteChat={handleDeleteChat}
            isAdmin={chatAdmins[currentChatId] === userId}
            currentUserId={userId}
            chatAdmins={chatAdmins}
          />
          )}
          <WaitingApproval chatName={invitedChatDetails.name} />
        </div>
      </div>
    );
  }

  if (showJoinRequest && invitedChatDetails) {
    return (
      <div className="flex flex-col h-screen bg-neutral-50 dark:bg-brand-grey-dark transition-colors">
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && (
          <Sidebar
            chats={filteredChats}
            originalChats={chats}
            setOriginalChats={setChats}
            currentChatId={currentChatId}
            onChatClick={handleChatClick}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onNewChat={() => setIsNewChatModalOpen(true)}
            onBackToChats={handleBackToChats}
            onBackToHome={() => navigate('/')}
            onJoinViaLink={() => setShowJoinViaLinkModal(true)}
            onDeleteChat={handleDeleteChat}
            isAdmin={chatAdmins[currentChatId] === userId}
            currentUserId={userId}
            chatAdmins={chatAdmins}
          />
          )}
          <RequestJoin
            chatName={invitedChatDetails.name}
            onJoinRequest={handleJoinRequest}
            onCancel={handleCancelJoinRequest}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-brand-grey-dark transition-colors">
      <div className="flex flex-1 overflow-hidden relative">
        {showSidebar && (
          <Sidebar
            chats={filteredChats}
            originalChats={chats}
            setOriginalChats={setChats}
            currentChatId={currentChatId}
            onChatClick={handleChatClick}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onNewChat={() => setIsNewChatModalOpen(true)}
            onBackToChats={handleBackToChats}
            onBackToHome={onBackToHome}
            onJoinViaLink={() => setShowJoinViaLinkModal(true)}
            onDeleteChat={handleDeleteChat}
            isAdmin={chatAdmins[currentChatId] === userId}
            currentUserId={userId}
            chatAdmins={chatAdmins}
          />
        )}

        {renderMainContent()}

        {urlChatId &&
          showChatInfo &&
          currentChatId &&
          currentChat?.status !== "pending" && (
            <ChatInfo
              chatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
              onBackToChat={() => setShowChatInfo(false)}
            />
          )}
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />

      {/* Delete Chat Modal */}
      {showDeleteModal && chatToDelete && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-brand-grey-medium rounded-2xl w-full max-w-md mx-4 shadow-xl border border-neutral-200 dark:border-brand-grey-light">
            <div className="font-['Inter'] p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-4">
                  <FaTimes className="text-red-600 dark:text-red-400 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-grey-dark dark:text-brand-white font-['Montserrat']">Delete Chat</h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-neutral-700 dark:text-neutral-300 mb-2">
                  Are you sure you want to delete <span className="font-semibold text-brand-grey-dark dark:text-brand-white">"{chatToDelete.name}"</span>?
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  All messages and data will be permanently removed.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setChatToDelete(null);
                  }}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-brand-grey-light rounded-xl transition-colors border border-neutral-200 dark:border-brand-grey-light"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteChat}
                  className="px-4 py-2 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded-xl transition-colors font-medium shadow-sm"
                >
                  Delete Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
        currentUserId={userId}
      />

      {/* Join Via Link Modal */}
      <JoinViaLinkModal
        isOpen={showJoinViaLinkModal}
        onClose={() => setShowJoinViaLinkModal(false)}
        onJoin={handleJoinViaLink}
      />
    </div>
  );
};

export default ChatRoom;
