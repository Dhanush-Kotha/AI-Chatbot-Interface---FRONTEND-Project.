
function Message({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`message ${isUser ? "user" : "ai"}`}>

      <div className="message-header">

        <strong>
          {isUser ? "You" : "✦ IntelliChat"}
        </strong>

      </div>

      <p>{text}</p>

    </div>
  );
}

export default Message;
