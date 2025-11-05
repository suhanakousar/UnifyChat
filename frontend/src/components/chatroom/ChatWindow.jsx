import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import React, { useEffect, useRef, useState } from "react";
import MessageActions from "./MessageActions";
import { AvatarChat, AvatarPerson, IconButton } from "./ReusableComponents";

import {
  FaBars,
  FaGlobe,
  FaImage,
  FaInfoCircle,
  FaMicrophone,
  FaPaperclip,
  FaPaperPlane,
  FaRegStopCircle,
  FaSearch,
  FaArrowLeft,
  FaSmile,
  FaEdit,
  FaTrash,
  FaCheckDouble,
  FaShare,
  FaReply,
  FaTimes,
} from "react-icons/fa";
import { languages } from "../../constants";
import MessageSearch from "./MessageSearch";
import EmojiPicker from "./EmojiPicker";
import { motion, AnimatePresence } from "framer-motion";

const MessageBubble = ({ 
  message, 
  currentUserId, 
  currentChat, 
  onUserClick,
  onReact,
  onEdit,
  onDelete,
  onForward,
  onReply,
  showReadReceipts,
  reactions = []
}) => {
  const isOwnMessage = message?.created_by === currentUserId;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group flex mb-4 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isOwnMessage && (
        <div className="mr-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onUserClick && message?.created_by && onUserClick(message.created_by)}>
          <AvatarPerson person={message?.sender} size="sm" />
        </div>
      )}
      <div className="flex flex-col max-w-[85%] md:max-w-md">
        {!isOwnMessage && (
          <div 
            className="font-['Inter'] text-xs text-neutral-600 dark:text-neutral-400 mb-1 cursor-pointer hover:text-brand-yellow dark:hover:text-brand-yellow-light transition-colors"
            onClick={() => message?.created_by && onUserClick && onUserClick(message.created_by)}
          >
            {message?.sender?.given_name}
          </div>
        )}
        <div className="relative flex items-end gap-2">
          <div
            className={`font-['Inter'] rounded-2xl px-4 py-3 inline-block break-words whitespace-normal shadow-sm transition-all ${
              isOwnMessage
                ? "bg-brand-yellow dark:bg-brand-yellow-light text-brand-grey-dark rounded-br-sm"
                : "bg-white dark:bg-brand-grey-medium text-brand-grey-dark dark:text-brand-white border border-neutral-200 dark:border-brand-grey-light rounded-bl-sm"
            }`}
          >
            {/* Reply Context */}
            {message?.replyTo && (
              <div className="mb-2 pb-2 border-b border-neutral-200 dark:border-brand-grey-light">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-['Inter'] flex items-center gap-1">
                  <FaReply size={10} />
                  <span className="font-semibold text-brand-yellow dark:text-brand-yellow-light">
                    {message.replyTo.sender?.given_name || 'User'}
                  </span>
                  <span className="truncate">{message.replyTo.content}</span>
                </p>
              </div>
            )}
            {message?.content}
            {/* Reactions */}
            {reactions && reactions.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {reactions.map((emoji, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-100 dark:bg-brand-grey-light px-2 py-0.5 rounded-full text-sm"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
            <div className={`font-['Inter'] text-xs mt-2 flex items-center justify-end gap-1 ${
              isOwnMessage
                ? "text-brand-grey-dark/70"
                : "text-neutral-500 dark:text-neutral-400"
            }`}>
              {message?.created_at
                ? new Date(message?.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
              {isOwnMessage && showReadReceipts && (
                <FaCheckDouble className="text-brand-yellow text-xs" />
              )}
            </div>
          </div>
          {isHovered && (
            <MessageActions
              message={message}
              currentUserId={currentUserId}
              onReact={onReact}
              onEdit={onEdit}
              onDelete={onDelete}
              onForward={onForward}
              onReply={onReply}
              showReadReceipts={showReadReceipts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ChatWindow = ({
  messages,
  currentChat,
  newMessage,
  setNewMessage,
  onSendMessage,
  isSending = false,
  messageContainerRef,
  toggleSidebar,
  toggleChatInfo,
  showChatInfo,
  onFileUpload,
  onImageUpload,
  onLoadMoreMessages,
  currentUserId,
  onUserClick,
  socket,
  onBack,
  replyingTo: externalReplyingTo,
  setReplyingTo: setExternalReplyingTo,
  onEditMessage,
  onDeleteMessage,
}) => {
  const [language, setLanguage] = useState("en");
  const speechKey = import.meta.env.VITE_SPEECH_KEY;
  const speechRegion = import.meta.env.VITE_SPEECH_REGION;
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recognizerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(externalReplyingTo || null);
  const [messageReactions, setMessageReactions] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  useEffect(() => {
    if (externalReplyingTo !== undefined) {
      setReplyingTo(externalReplyingTo);
    }
  }, [externalReplyingTo]);
  
  const handleSetReplyingTo = (value) => {
    setReplyingTo(value);
    if (setExternalReplyingTo) {
      setExternalReplyingTo(value);
    }
  };

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 100 && currentChat?.id) {
        onLoadMoreMessages(currentChat.id);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentChat, onLoadMoreMessages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSendClick();
    }
  };
  
  const handleSendClick = () => {
    if (isSending || !newMessage.trim()) return;
    
    if (replyingTo && onSendMessage) {
      onSendMessage(replyingTo);
      handleSetReplyingTo(null);
    } else {
      onSendMessage();
    }
    handleStopTyping();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    
    if (!isTyping && value.trim() && socket && currentChat?.id) {
      setIsTyping(true);
      socket.emit("typing", {
        roomId: currentChat.id,
        userName: currentChat.name,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };

  const handleStopTyping = () => {
    if (socket && currentChat?.id) {
      if (isTyping) {
        setIsTyping(false);
        socket.emit("stop-typing", {
          roomId: currentChat.id,
        });
      }
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  useEffect(() => {
    if (!socket || !currentChat?.id) {
      return;
    }

    const handleUserTyping = (data) => {
      if (data.userId !== currentUserId && data.roomId === currentChat.id) {
        setTypingUsers((prev) => {
          if (!prev.find((u) => u.userId === data.userId)) {
            return [...prev, { userId: data.userId, userName: data.userName }];
          }
          return prev;
        });

        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        }, 3000);
      }
    };

    const handleUserStopTyping = (data) => {
      if (data.userId !== currentUserId && data.roomId === currentChat.id) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    };

    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
      handleStopTyping();
    };
  }, [socket, currentChat?.id, currentUserId]);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageButtonClick = () => {
    imageInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
      e.target.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
      e.target.value = "";
    }
  };
  const handleSpeechToTextStart = () => {
    const speechConfig = SpeechConfig.fromSubscription(speechKey, speechRegion);
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    speechConfig.setProperty("speechServiceConnection_Language", "auto");
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    recognizerRef.current = recognizer;
    setIsRecording(true);

    recognizer.startContinuousRecognitionAsync(
      () => {},
      (err) => {
        setIsRecording(false);
      }
    );

    recognizer.recognizing = (s, e) => {
      setNewMessage(e.result.text);
    };
  };

  const handleSpeechToTextStop = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          setIsRecording(false);
        },
        (err) => {
          setIsRecording(false);
        }
      );
    }
  };

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await fetch(
        `https://api.cognitive.microsofttranslator.com//translate?api-version=3.0&to=${targetLanguage}`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": import.meta.env.VITE_TRANS_KEY,

            "Ocp-Apim-Subscription-Region": import.meta.env.VITE_TRANS_REGION,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ Text: text }]),
        }
      );
      const data = await response.json();
      const translated = data[0].translations[0].text;
      return translated;
    } catch (error) {
    }
  };

  useEffect(() => {
    const translateIncomingMessages = async () => {
      const updatedMessages = await Promise.all(
        messages.map(async (message) => {
          if (message?.language !== language) {
            const translatedContent = await translateText(
              message?.content,
              language
            );
            return { ...message, content: translatedContent };
          }
          return message;
        })
      );
      setTranslatedMessages(updatedMessages);
    };

    if (messages.length > 0) {
      translateIncomingMessages();
    } else {
      setTranslatedMessages([]);
    }
  }, [language, messages]);

  return (
    <div
      className={`flex-1 flex flex-col bg-neutral-50 dark:bg-brand-grey-dark transition-colors h-full`}
    >
      {/* Message Search */}
      <MessageSearch
        messages={messages}
        onSelectMessage={(message) => {
          const container = messageContainerRef.current;
          if (container) {
          }
        }}
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />

      <div className="p-3 md:p-4 lg:p-5 border-b border-neutral-200 dark:border-brand-grey-light bg-white dark:bg-brand-grey-medium flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center flex-1 min-w-0">
          {/* Back Button - Always visible on mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (onBack) {
                onBack();
              } else if (toggleSidebar) {
                toggleSidebar();
              }
            }}
            className="mr-2 md:mr-3 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-brand-grey-light text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-white transition-colors active:scale-95"
            title="Back to chats"
          >
            <FaArrowLeft size={18} className="md:hidden" />
            <FaBars size={18} className="hidden md:block" />
          </motion.button>

          <AvatarChat
            color={currentChat?.avatar_color}
            text={currentChat?.avatar_text}
          />
          <div className="ml-3 flex-1 min-w-0">
            <h2 className="font-['Montserrat'] font-bold text-lg md:text-xl text-brand-grey-dark dark:text-brand-white truncate">
              {currentChat?.name || "Chat"}
            </h2>
            {currentChat?.description && (
              <p className="font-['Inter'] text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {currentChat.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <IconButton icon={<FaGlobe />} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="font-['Inter'] text-sm px-3 py-1.5 border border-neutral-200 dark:border-brand-grey-light rounded-lg bg-white dark:bg-brand-grey-light text-brand-grey-dark dark:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light transition-colors cursor-pointer"
            >
              {languages.map((lang, i) => (
                <option key={i} value={lang.code}>
                  {lang.language}
                </option>
              ))}
            </select>
          </div>
          <IconButton
            icon={<FaSearch />}
            onClick={() => setShowSearch(!showSearch)}
            className={showSearch ? "bg-neutral-100 dark:bg-brand-grey-light" : ""}
          />
          <IconButton
            icon={<FaInfoCircle />}
            onClick={toggleChatInfo}
            className={showChatInfo ? "bg-neutral-100 dark:bg-brand-grey-light" : ""}
          />
        </div>
      </div>

      <div className="flex-1 p-3 md:p-4 lg:p-6 overflow-y-auto bg-neutral-50 dark:bg-brand-grey-dark pb-safe" ref={messageContainerRef}>
        {translatedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 mb-4 rounded-full bg-brand-yellow/10 dark:bg-brand-yellow-light/10 flex items-center justify-center">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-brand-grey-dark dark:text-brand-white mb-2 font-['Montserrat']">
              No messages yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 font-['Inter']">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          translatedMessages.map((message, i) => {
          const currentDate = new Date(message.created_at);
          const prevDate = i > 0 ? new Date(translatedMessages[i - 1].created_at) : null;

          const shouldShowDateSeparator =
            i === 0 ||
            !prevDate ||
            currentDate.getFullYear() !== prevDate.getFullYear() ||
            currentDate.getMonth() !== prevDate.getMonth() ||
            currentDate.getDate() !== prevDate.getDate();

          return (
            <div key={message.id || `message-${i}`}>
              {shouldShowDateSeparator && (
                <div className="font-['Inter'] text-xs font-semibold flex justify-center items-center mb-4 text-neutral-500 dark:text-neutral-400">
                  <span className="px-3 py-1 bg-white dark:bg-brand-grey-medium rounded-full border border-neutral-200 dark:border-brand-grey-light">
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {editingMessage && editingMessage.id === message.id ? (
                <div className="mb-4 flex flex-col gap-2">
                  <textarea
                    className="font-['Inter'] border border-neutral-200 dark:border-brand-grey-light rounded-xl p-3 w-full resize-none bg-white dark:bg-brand-grey-light text-brand-grey-dark dark:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light transition-colors"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditingMessage(null);
                        setEditContent('');
                      }}
                      className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-brand-grey-light text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-brand-grey-dark transition-colors font-['Inter']"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (editContent.trim() && onEditMessage) {
                          onEditMessage(message, editContent.trim());
                          setEditingMessage(null);
                          setEditContent('');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-brand-yellow dark:bg-brand-yellow-light text-brand-grey-dark hover:bg-brand-yellow/90 dark:hover:bg-brand-yellow-light/90 transition-colors font-['Inter'] font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <MessageBubble
                  message={message}
                  currentUserId={currentUserId}
                  currentChat={currentChat}
                  onUserClick={onUserClick}
                  onReact={(messageId, emoji) => {
                    setMessageReactions((prev) => {
                      const existing = prev[messageId] || [];
                      const index = existing.indexOf(emoji);
                      if (index > -1) {
                        return {
                          ...prev,
                          [messageId]: existing.filter((e) => e !== emoji),
                        };
                      } else {
                        return {
                          ...prev,
                          [messageId]: [...existing, emoji],
                        };
                      }
                    });
                  }}
                  onEdit={(message) => {
                    setEditingMessage({ id: message.id, content: message.content });
                    setEditContent(message.content);
                  }}
                  onDelete={(messageId) => {
                    if (window.confirm("Are you sure you want to delete this message?")) {
                      if (onDeleteMessage) {
                        onDeleteMessage(messageId);
                      }
                    }
                  }}
                  onForward={(message) => {
                  }}
                  onReply={(message) => {
                    handleSetReplyingTo(message);
                    setShowEmojiPicker(false);
                  }}
                  showReadReceipts={true}
                  reactions={messageReactions[message.id] || []}
                />
              )}
            </div>
          );
          })
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 text-neutral-500 dark:text-neutral-400 italic font-['Inter'] text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>
              {typingUsers.length === 1
                ? `${typingUsers[0].userName} is typing...`
                : `${typingUsers.length} people are typing...`}
            </span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-neutral-50 dark:bg-brand-grey-dark border-t border-neutral-200 dark:border-brand-grey-light flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-0.5 h-8 bg-brand-yellow rounded-full"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-grey-dark dark:text-brand-white font-['Inter']">
                Replying to {replyingTo.sender?.given_name || 'User'}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate font-['Inter']">
                {replyingTo.content}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSetReplyingTo(null)}
            className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-brand-grey-light text-neutral-500 dark:text-neutral-400 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>
      )}

      <div className="p-3 md:p-4 lg:p-6 bg-white dark:bg-brand-grey-medium border-t border-neutral-200 dark:border-brand-grey-light flex flex-col md:flex-row items-end gap-2 pb-safe">
        {/* Mobile Action Buttons Row - Shown on small screens */}
        <div className="flex md:hidden items-center gap-2 w-full pb-2 border-b border-neutral-200 dark:border-brand-grey-light">
          <IconButton
            icon={<FaPaperclip />}
            className="flex-1 text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-brand-white p-2.5"
            onClick={handleFileButtonClick}
          />
          <IconButton
            icon={<FaImage />}
            className="flex-1 text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-brand-white p-2.5"
            onClick={handleImageButtonClick}
          />
          <div className="relative flex-1">
            <IconButton
              icon={<FaSmile />}
              className="w-full text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-brand-white p-2.5"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <EmojiPicker
                  isOpen={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                  onSelectEmoji={(emoji) => {
                    setNewMessage((prev) => prev + emoji);
                  }}
                />
              </>
            )}
          </div>
          <IconButton
            icon={
              isRecording ? (
                <FaRegStopCircle className="text-red-500" />
              ) : (
                <FaMicrophone />
              )
            }
            className={`flex-1 ${isRecording ? "text-red-500" : "text-neutral-600 dark:text-neutral-400"} hover:text-brand-grey-dark dark:hover:text-brand-white p-2.5`}
            onClick={
              isRecording ? handleSpeechToTextStop : handleSpeechToTextStart
            }
          />
        </div>

        {/* Desktop Action Buttons - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <IconButton
            icon={<FaPaperclip />}
            className="text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-brand-white"
            onClick={handleFileButtonClick}
          />
          <IconButton
            icon={<FaImage />}
            className="text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-brand-white"
            onClick={handleImageButtonClick}
          />
          <div className="relative">
            <IconButton
              icon={<FaSmile />}
              className="text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-brand-white"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <EmojiPicker
                  isOpen={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                  onSelectEmoji={(emoji) => {
                    setNewMessage((prev) => prev + emoji);
                  }}
                />
              </>
            )}
          </div>
          <IconButton
            icon={
              isRecording ? (
                <FaRegStopCircle className="text-red-500" />
              ) : (
                <FaMicrophone />
              )
            }
            className={`${isRecording ? "text-red-500" : "text-neutral-600 dark:text-neutral-400"} hover:text-brand-grey-dark dark:hover:text-brand-white`}
            onClick={
              isRecording ? handleSpeechToTextStop : handleSpeechToTextStart
            }
          />
        </div>

        <div className="flex-1 mx-1 md:mx-2 min-w-0 w-full md:w-auto">
          <textarea
            className="font-['Inter'] placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-brand-grey-light rounded-xl p-3 w-full resize-none bg-white dark:bg-brand-grey-light text-brand-grey-dark dark:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light transition-colors max-h-32 text-base md:text-sm"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            rows={1}
          />
        </div>
        <IconButton
          icon={<FaPaperPlane className="text-brand-yellow dark:text-brand-yellow-light" />}
          className={`hover:bg-brand-yellow/10 dark:hover:bg-brand-yellow/20 p-2.5 md:p-2 flex-shrink-0 ${isSending || !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSendClick}
          disabled={isSending || !newMessage.trim()}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
