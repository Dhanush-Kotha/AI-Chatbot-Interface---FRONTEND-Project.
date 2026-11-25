import { useRef, useState } from "react";

function PromptBox({ onSend, disabled = false }) {

  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Send message
  const handleSend = () => {

    const message = input.trim();

    if (!message || disabled) return;

    onSend(message);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Auto resize textarea
  const handleChange = (e) => {

    setInput(e.target.value);

    e.target.style.height = "auto";

    e.target.style.height =
      Math.min(e.target.scrollHeight, 140) + "px";
  };

  // Keyboard controls
  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (

    <div className="composer-area">

      <div className="prompt-box">

        {/* Message Input */}

        <textarea
          ref={textareaRef}
          className="prompt-textarea"
          placeholder="Type your message here..."
          value={input}
          rows="1"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        {/* Prompt Toolbar */}

        <div className="prompt-toolbar">

          <span className="prompt-hint">
            ✦ AI Assistant
          </span>

          {/* Premium Send Button */}

          <button
            className="prompt-send"
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            aria-label="Send message"
            title="Send message"
          >

            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>

          </button>

        </div>

      </div>

      {/* Footer */}

      <p className="footer-text">
        IntelliChat can make mistakes. Verify important information.
      </p>

    </div>

  );
}

export default PromptBox;