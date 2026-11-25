function formatChatTime(timestamp) {

  const date = new Date(timestamp);

  const today = new Date();

  if (date.toDateString() === today.toDateString()) {

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

}

function Sidebar({
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  darkMode,
  onToggleTheme,
}) {

  // Latest conversations first
  const sortedChats = [...chats].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  return (

    <aside className="sidebar">

      {/* Branding */}

      <h2>✦ IntelliChat</h2>

      {/* New Chat */}

      <button
        className="new-chat"
        onClick={onNewChat}
      >
        + New Chat
      </button>

      {/* Recent Conversations */}

      <div className="sidebar-history">

        <h4>RECENT CHATS</h4>

        {sortedChats.length === 0 ? (

          <p className="history-empty">
            Your conversations will appear here.
          </p>

        ) : (

          <div className="history-list">

            {sortedChats.map((chat) => (

              <button
                key={chat.id}
                className={`history-item ${
                  activeChatId === chat.id ? "active" : ""
                }`}
                onClick={() => onSelectChat(chat.id)}
                title={chat.title}
              >

                <span className="history-title">
                  💬 {chat.title}
                </span>

                <span className="history-time">
                  {formatChatTime(chat.updatedAt)}
                </span>

              </button>

            ))}

          </div>

        )}

      </div>

      {/* Theme Toggle */}

      <button
        className="theme-button"
        onClick={onToggleTheme}
      >

        {darkMode ? "☀ Light Mode" : "☾ Dark Mode"}

      </button>

    </aside>

  );

}

export default Sidebar;