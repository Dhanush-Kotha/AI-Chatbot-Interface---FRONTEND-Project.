import { useEffect, useRef, useState } from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import PromptBox from "./components/PromptBox";

const STORAGE_KEY = "intellichat_chat_history_v1";

// Generate unique IDs
const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Generate chat title
const createTitle = (message) => {
  const title = message.trim().replace(/\s+/g, " ");

  return title.length > 32
    ? title.slice(0, 32) + "..."
    : title;
};

// Load saved conversations
function loadChatData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      const chats = Array.isArray(parsed.chats)
        ? parsed.chats
            .filter((chat) => chat && typeof chat.id === "string")
            .map((chat) => ({
              ...chat,
              messages: Array.isArray(chat.messages)
                ? chat.messages
                : [],
              title: chat.title || "New Chat",
              updatedAt: Number(chat.updatedAt) || Date.now(),
            }))
        : [];

      const activeChatExists = chats.some(
        (chat) => chat.id === parsed.activeChatId
      );

      return {
        chats,
        activeChatId: activeChatExists
          ? parsed.activeChatId
          : null,
      };
    }
  } catch (error) {
    console.error("Unable to load chat history:", error);
  }

  return {
    chats: [],
    activeChatId: null,
  };
}

// Demo AI response
function getResponse(message) {
  const question = message.toLowerCase();

  if (question.includes("hello") || question.includes("hi")) {
    return "Hello! Welcome to IntelliChat. How can I help you today?";
  }

  if (question.includes("react")) {
    return "React is a JavaScript library used to build interactive user interfaces using reusable components.";
  }

  if (question.includes("python")) {
    return "Python is a beginner-friendly programming language widely used in AI, Machine Learning and automation.";
  }

  if (question.includes("ai")) {
    return "Artificial Intelligence enables machines to perform tasks that typically require human intelligence.";
  }

  return "That's an interesting question! I'm currently running in demo mode. Real AI integration will be added in the next phase.";
}

function App() {

  // Application data
  const [appData, setAppData] = useState(loadChatData);

  // Track chats currently receiving a response
  const [typingChatIds, setTypingChatIds] = useState([]);

  // Theme
  const [darkMode, setDarkMode] = useState(true);

  // Store pending timers
  const timersRef = useRef(new Set());

  // Active conversation
  const activeChat = appData.chats.find(
    (chat) => chat.id === appData.activeChatId
  );

  const messages = activeChat?.messages || [];

  // Automatically save conversations to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appData)
      );
    } catch (error) {
      console.error("Unable to save chat history:", error);
    }
  }, [appData]);

  // Clean up pending timers
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  // Send message
  const sendMessage = (message) => {

    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    const chatId = appData.activeChatId || createId();

    const now = Date.now();

    const userMessage = {
      id: createId(),
      role: "user",
      text: cleanMessage,
      createdAt: now,
    };

    // Add message to conversation
    setAppData((previous) => {

      const existingChat = previous.chats.find(
        (chat) => chat.id === chatId
      );

      if (existingChat) {

        return {
          ...previous,

          activeChatId: chatId,

          chats: previous.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,

                  title:
                    chat.messages.length === 0
                      ? createTitle(cleanMessage)
                      : chat.title,

                  updatedAt: now,

                  messages: [
                    ...chat.messages,
                    userMessage,
                  ],
                }
              : chat
          ),
        };

      }

      // Create new conversation
      const newChat = {
        id: chatId,
        title: createTitle(cleanMessage),
        createdAt: now,
        updatedAt: now,
        messages: [userMessage],
      };

      return {
        ...previous,
        activeChatId: chatId,
        chats: [...previous.chats, newChat],
      };

    });

    // Show typing indicator
    setTypingChatIds((previous) =>
      previous.includes(chatId)
        ? previous
        : [...previous, chatId]
    );

    // Generate demo response
    const timer = setTimeout(() => {

      timersRef.current.delete(timer);

      const aiMessage = {
        id: createId(),
        role: "ai",
        text: getResponse(cleanMessage),
        createdAt: Date.now(),
      };

      setAppData((previous) => ({
        ...previous,

        chats: previous.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  aiMessage,
                ],
                updatedAt: Date.now(),
              }
            : chat
        ),
      }));

      setTypingChatIds((previous) =>
        previous.filter((id) => id !== chatId)
      );

    }, 1000);

    timersRef.current.add(timer);

  };

  // Create new conversation
  const handleNewChat = () => {
    setAppData((previous) => ({
      ...previous,
      activeChatId: null,
    }));
  };

  // Open previous conversation
  const handleSelectChat = (chatId) => {
    setAppData((previous) => ({
      ...previous,
      activeChatId: chatId,
    }));
  };

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const isTyping = typingChatIds.includes(
    appData.activeChatId
  );

  return (

    <div className={`app ${darkMode ? "dark" : "light"}`}>

      <Sidebar
        chats={appData.chats}
        activeChatId={appData.activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />

      <main className="chat-container">

        <header className="topbar">

          <h3>AI Assistant</h3>

          <span>● Demo Mode</span>

        </header>

        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          onSuggestion={sendMessage}
        />

        <PromptBox
          onSend={sendMessage}
          disabled={isTyping}
        />

      </main>

    </div>

  );
}

export default App;