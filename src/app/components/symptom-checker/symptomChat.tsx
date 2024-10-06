"use client"
import React, { useState } from 'react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle message send
  const handleSendMessage = async () => {
    if (!symptoms) return;

    // Add user message to chat history
    setChatHistory((prev) => [...prev, { sender: 'user', text: symptoms }]);
    setLoading(true);

    try {
      // Send the user's input to the AI backend
      const response = await fetch('/api/symptom-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: symptoms }),
      });

      const data = await response.json();

      // Add AI's response to chat history
      if (response.ok) {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'ai', text: data.response },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'ai', text: 'There was an issue generating the response.' },
        ]);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: 'An error occurred. Please try again.' },
      ]);
    }

    setLoading(false);
    setSymptoms(''); // Reset the input field
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Symptom Checker</h2>

      {/* Chat History */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 max-h-96 overflow-y-auto">
        {chatHistory.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <p className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {message.text}
            </p>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex">
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms..."
          className="flex-grow p-2 border rounded-l-lg"
        />
        <button
          onClick={handleSendMessage}
          className="bg-indigo-600 text-white p-2 rounded-r-lg"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default SymptomChecker;
