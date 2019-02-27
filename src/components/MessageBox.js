import React from 'react';

const MessageBox = ({ msg, userID }) => {
  
  const className = (msg.user._id === userID) ? "MessageRow Me" : "MessageRow";

  return (
    <div className={className}>
      <div className="ChatBubble">
        <div className="username">{msg.user.name}</div>
        <div className="text">{msg.text}</div>
      </div>
    </div>
  );

}

export default MessageBox;