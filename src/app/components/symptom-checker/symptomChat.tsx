"use client"
import React, { useState, useEffect } from 'react';
import StyledAIResponse from '@/app/components/symptom-checker/styledAi'; // Adjust the import path as needed

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatSession {
  id: number;
  sessionName: string;
}

const SymptomChecker: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null); // Fetch userId dynamically
  const [symptoms, setSymptoms] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched userId:', data.userId); // Add this log
        if (data.userId) {
          setUserId(data.userId);
        } else {
          console.error('userId is undefined in the response:', data);
        }
      } catch (error) {
        console.error("Failed to fetch user session info:", error);
      }
    };
    fetchUserId();
  }, []);
  

  // Fetch previous chat sessions when userId is available
  useEffect(() => {
    if (userId) {
      const fetchChatSessions = async () => {
        try {
          const response = await fetch(`/api/ai/chat-sessions?userId=${userId}`);
          const data = await response.json();
          setChatSessions(data.sessions);
        } catch (error) {
          console.error('Failed to fetch chat sessions:', error);
        }
      };

      fetchChatSessions();
    }
  }, [userId]);

  const handleSendMessage = async () => {
    console.log('handleSendMessage called');
    console.log('Current symptoms:', symptoms); // Add this log
    console.log('Current userId:', userId); // Add this log
    if (!symptoms || !userId) {
      console.log('Missing symptoms or userId');
      return;
    }
  
    setChatHistory((prev) => [...prev, { sender: 'user', text: symptoms }]);
    setLoading(true);
  
    try {
      const response = await fetch('/api/ai/symptom-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: symptoms,
          userId,  // Attach userId
          chatSessionId: currentSessionId,  // Attach to existing session if available
        }),
      });
  
      const data = await response.json();
      console.log('API response:', data);
  
      if (response.ok) {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'ai', text: data.response }, // Display the AI response
        ]);
        if (!currentSessionId) {
          // If it's a new session, save the session ID
          setCurrentSessionId(data.savedDiagnosis.chatSessionId);
        }
      } else {
        console.error('API error:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: 'An error occurred. Please try again.' },
      ]);
    }
  
    setLoading(false);
    setSymptoms('');
  };
  

  const loadChatSession = async (sessionId: number) => {
    setCurrentSessionId(sessionId);
    // Fetch chat history for the selected session
    try {
      const response = await fetch(`/api/ai/chat-session/${sessionId}`);
      const data = await response.json();
      setChatHistory(data.diagnoses.map((msg: any) => ({
        sender: 'ai',
        text: msg.diagnosisText,
      })));  // Load previous chat history
    } catch (error) {
      console.error('Failed to load chat session:', error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar with chat sessions */}
      <div className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-lg font-bold">Previous Sessions</h2>
        <ul>
          {chatSessions.map((session) => (
            <li key={session.id}>
              <button
                onClick={() => loadChatSession(session.id)}
                className="text-blue-500 hover:underline"
              >
                {session.sessionName}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Interface */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl font-bold">AI Symptom Checker</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 max-h-96 overflow-y-auto">
          {chatHistory.map((message, index) => (
            <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              {message.sender === 'user' ? (
                <p className="inline-block p-2 rounded-lg bg-blue-500 text-white">
                  {message.text}
                </p>
              ) : (
                <StyledAIResponse text={message.text} />
              )}
            </div>
          ))}
        </div>

        {/* Input field */}
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
    </div>
  );
};

export default SymptomChecker;