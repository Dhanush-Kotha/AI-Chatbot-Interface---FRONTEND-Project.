
function ChatWindow({
  messages = [],
  isTyping = false,
  onSuggestion
}) {

  const suggestions = [
    {
      icon: "💡",
      label: "Get coding help",
      prompt: "Help me with coding and programming."
    },
    {
      icon: "📊",
      label: "Learn AI & ML",
      prompt: "Explain Artificial Intelligence and Machine Learning."
    },
    {
      icon: "📄",
      label: "Explain concepts",
      prompt: "Explain a technical concept in simple terms."
    },
    {
      icon: "🚀",
      label: "Build a project",
      prompt: "Guide me through building a programming project."
    }
  ];

  return (

    <section className="chat-area">

      {messages.length === 0 ? (

        <div className="welcome">

          <h1>✦</h1>

          <h2>
            What can I help you with today?
          </h2>

          <p>
            Ask anything. Explore ideas. Learn something new.
          </p>

          <div className="suggestion-list">

            {suggestions.map((item) => (

              <button
                key={item.label}
                className="suggestion-button"
                onClick={() => onSuggestion(item.prompt)}
              >

                {item.icon} &nbsp;
                {item.label}

              </button>

            ))}

          </div>

        </div>

      ) : (

        <div className="messages">

          {messages.map((message, index) => (

            <div
              key={message.id || index}
              className={`message ${
                message.role === "user" ? "user" : "ai"
              }`}
            >

              <div className="message-header">
                {message.role === "user" ? "You" : "✦ IntelliChat"}
              </div>

              <p>{message.text}</p>

            </div>

          ))}

          {isTyping && (

            <div className="message ai typing">
              <div className="message-header">
                ✦ IntelliChat
              </div>
              <p>Thinking...</p>
            </div>

          )}

        </div>

      )}

    </section>

  );

}

export default ChatWindow;
