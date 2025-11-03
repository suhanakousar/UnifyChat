import { AvatarChat, AvatarPerson } from "./ReusableComponents.jsx";
import { TabButton } from "./ReusableComponents.jsx";
import { IconButton } from "./ReusableComponents.jsx";
import { FaSearch, FaCommentDots, FaTrash, FaEllipsisV, FaArrowLeft, FaLink } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const showTime = (timestamp) => {
  const sentTime = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - sentTime) / 1000);

  if (diffInSeconds < 60) return "now"; // Less than 1 minute
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`; // Less than 1 hour
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`; // Less than 1 day
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d`; // Less than 1 month
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}m`; // Less than 1 year
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} y`; // More than 1 year
};

const Sidebar = ({
  chats,
  currentChatId,
  onChatClick,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  onNewChat,
  onDeleteChat,
  isAdmin,
  currentUserId,
  chatAdmins,
  onBackToHome,
  onJoinViaLink,
}) => {
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ chatId: null, x: 0, y: 0 });
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu({ chatId: null, x: 0, y: 0 });
      }
    };

    if (contextMenu.chatId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu.chatId]);

  const handleContextMenu = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ chatId, x: e.clientX, y: e.clientY });
  };

  const handleDelete = (chatId, e) => {
    e.stopPropagation();
    setContextMenu({ chatId: null, x: 0, y: 0 });
    if (onDeleteChat && chatAdmins && currentUserId && chatAdmins[chatId] === currentUserId) {
      onDeleteChat(chatId);
    }
  };

  return (
    <div
      className={`w-80 border-r border-neutral-200 dark:border-brand-grey-light bg-white dark:bg-brand-grey-medium flex flex-col transition-colors h-full`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-brand-grey-light flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToHome}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-brand-grey-light text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-white transition-colors"
              title="Back to home"
            >
              <FaArrowLeft size={18} />
            </motion.button>
          )}
          <h1 className="text-brand-grey-dark dark:text-brand-white font-['Montserrat'] text-[1.75rem] font-bold">
            Chats
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {onJoinViaLink && (
            <IconButton 
              icon={<FaLink />} 
              onClick={onJoinViaLink}
              title="Join via invite link"
            />
          )}
          <IconButton icon={<FaCommentDots />} onClick={onNewChat} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="bg-neutral-100 dark:bg-brand-grey-light rounded-full p-2 flex items-center border border-neutral-200 dark:border-brand-grey-light">
          <FaSearch className="text-neutral-500 dark:text-neutral-400 mx-2" />
          <input
            type="text"
            placeholder="Search"
            className="font-['Inter'] bg-transparent outline-none w-full placeholder-neutral-400 dark:placeholder-neutral-500 text-brand-grey-dark dark:text-brand-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex px-4 gap-2 mb-2">
        <TabButton
          text="All"
          isActive={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        />
        <TabButton
          text="Unread"
          isActive={activeFilter === "unread"}
          onClick={() => setActiveFilter("unread")}
        />
        <TabButton
          text="Pending"
          isActive={activeFilter === "pending"}
          onClick={() => setActiveFilter("pending")}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">No chats found</div>
        ) : (
          chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`group relative py-3 px-4 border-b border-neutral-200 dark:border-brand-grey-light hover:bg-neutral-50 dark:hover:bg-brand-grey-light flex items-center cursor-pointer transition-all duration-200 ${
                chat.id === currentChatId ? "bg-brand-yellow/10 dark:bg-brand-yellow/20 border-l-4 border-l-brand-yellow shadow-sm" : ""
              }`}
              onClick={() => onChatClick(chat.id)}
              onMouseEnter={() => setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
              onContextMenu={(e) => handleContextMenu(e, chat.id)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <AvatarChat color={chat.avatar_color} text={chat.avatar_text} />
              </motion.div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-['Montserrat'] font-semibold text-brand-grey-dark dark:text-brand-white truncate">
                    {chat.name}
                  </span>
                  <span className="font-['Inter'] text-neutral-500 dark:text-neutral-400 text-xs ml-2 flex-shrink-0">
                    {showTime(chat.updated_at)}
                  </span>
                </div>
                <p className="font-['Inter'] text-neutral-600 dark:text-neutral-400 text-sm truncate">
                  {chat.last_message}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {chat.unread && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-brand-yellow dark:bg-brand-yellow-light rounded-full h-2 w-2 flex-shrink-0"
                  />
                )}
                {chatAdmins && currentUserId && chatAdmins[chat.id] === currentUserId && hoveredChatId === chat.id && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleDelete(chat.id, e)}
                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                    title="Delete chat"
                  >
                    <FaTrash size={12} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.chatId && (
          <motion.div
            ref={contextMenuRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bg-white dark:bg-brand-grey-medium rounded-lg shadow-xl border border-neutral-200 dark:border-brand-grey-light z-50 py-2 min-w-[160px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            {chatAdmins && currentUserId && chatAdmins[contextMenu.chatId] === currentUserId && (
              <button
                onClick={(e) => handleDelete(contextMenu.chatId, e)}
                className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors font-['Inter'] text-sm"
              >
                <FaTrash size={14} />
                Delete Chat
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
