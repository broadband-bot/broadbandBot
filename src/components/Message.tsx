import React from 'react';
import { MessageDto } from "./models/MessageDto";
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: MessageDto;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div 
      style={{ 
        display: "flex",
        justifyContent: message.isUser ? "flex-end" : "flex-start",
        margin: "0px",
        width: '100%', // Ensure the container takes the full width
      }}
    >
      <div
        style={{
          color: message.isUser ? "#ffffff" : "#000000",
          backgroundColor: message.isUser ? "#1186fe" : "#CBC3E3",
          padding: "20px",
          borderRadius: "20px",
          maxWidth: "100%",
          textAlign: "left",
        }}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
