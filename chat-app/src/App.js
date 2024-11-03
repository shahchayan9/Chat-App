import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:8080');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
  
    // Set up the socket event listener
    socket.on('receiveMessage', handleReceiveMessage);
  
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      // Send message as "user1"
      const user1Message = { text: message, sender: 'user1' };
      socket.emit('sendMessage', user1Message); // Emit message to server
  
      // Simulate receiving a response from "user2"
      setTimeout(() => {
        const responses = [
          "Nice",
          "i am fine",
          "let's catch up",
          "I agree with you.",
          "Really? Wow!",
          "Can you explain further?",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const user2Message = { text: randomResponse, sender: 'user2' };
        setMessages((prevMessages) => [...prevMessages, user2Message]);
      }, 1000); // Delay for 1 second to simulate response
  
      setMessage(''); // Clear the input field
    }
  };
  

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === 'user1' ? 'message-you' : 'message-other'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
