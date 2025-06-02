import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FaSun, FaMoon, FaPaperPlane, FaCamera, FaTrash, FaSignOutAlt, FaCheck, FaTimes } from 'react-icons/fa';
import './Chatbot.css';
import logo from '../assets/logo.svg';
import { SERVER_URL } from '../main'; 
import { useNavigate } from 'react-router-dom';


function Chatbot({ user, onLogout }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Hello ${user.displayName}, I'm BetterSight, your ophthalmology assistant. How can I help with your eye health concerns today?` }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [doctorResults, setDoctorResults] = useState(null);
  const [mapUrl, setMapUrl] = useState('');
  const [showDoctorPrompt, setShowDoctorPrompt] = useState(false);
  const [pendingDoctorRequest, setPendingDoctorRequest] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Toggle dark/light theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Apply theme class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const queryChatModel = async (prompt) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/chat`,
        {
          userId: user.uid,
          message: prompt
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error querying chat model:', error);
      return {
        text: "I'm experiencing technical difficulties. Please try again later.",
        requiresPhoto: false,
        requestsDoctors: false
      };
    }
  };

  const analyzeImageWithAI = async (base64Image) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/analyze-image`,
        {
          userId: user.uid,
          imageBase64: base64Image
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error analyzing image:', error);
      return {
        analysis: "Technical error during image analysis.",
        explanation: "Sorry, we encountered an error analyzing your image. Please try again or consult an eye doctor.",
        requestsDoctors: false
      };
    }
  };

  const findNearbyDoctors = async (specialty = "ophthalmologist") => {
    try {
      const getCurrentPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const response = await axios.get(`${SERVER_URL}/api/nearby-doctors`, {
        params: {
          lat: latitude,
          lng: longitude,
          specialty,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error finding nearby doctors:", error);
      return {
        doctors: [],
        mapUrl: "",
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = inputMessage;
    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);
    
    // Get AI response from backend
    const { text, requiresPhoto, requestsDoctors } = await queryChatModel(userMessage);
    
    // Update UI based on response
    setShowImageUpload(requiresPhoto);
    
    let aiResponse = text;
    const newMessagesWithResponse = [...newMessages, { sender: 'bot', text: aiResponse }];
    setMessages(newMessagesWithResponse);

    // Handle doctor recommendations if needed
    if (requestsDoctors) {
      setPendingDoctorRequest(aiResponse);
      setShowDoctorPrompt(true);
    }
    
    setIsTyping(false);
  };

  const handleShowDoctors = async (consent) => {
    setShowDoctorPrompt(false);
    
    if (consent) {
      setIsTyping(true);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Looking for nearby eye specialists..."
      }]);
      
      try {
        const specialty = pendingDoctorRequest.match(/see an? (.+?)(?:,|\.|$)/i)?.[1] || "ophthalmologist";
        const { doctors, mapUrl } = await findNearbyDoctors(specialty);
        setDoctorResults(doctors);
        setMapUrl(mapUrl);
        
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: `Here are some ${specialty}s near you:`
        }]);
      } catch (error) {
        console.error('Error finding doctors:', error);
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: "I couldn't find nearby specialists. Please try a manual search."
        }]);
      }
      
      setIsTyping(false);
    } else {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Understood. Let me know if you'd like help finding specialists later."
      }]);
    }
    
    setPendingDoctorRequest(null);
  };

  const handleClearChat = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/clear-chat`, {
        userId: user.uid
      });
      
      if (response.data.success) {
        setMessages([{ 
          sender: 'bot', 
          text: `Hello ${user.displayName}, I'm BetterSight. How can I help with your eye health concerns today?` 
        }]);
        setDoctorResults(null);
        setMapUrl('');
        setShowImageUpload(false);
        setShowDoctorPrompt(false);
        setPendingDoctorRequest(null);
      } else {
        console.error('Failed to clear chat:', response.data.error);
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Sorry, I couldn't clear our chat history. Please try again."
      }]);
    }
  };

  const handleEyePhotoUpload = async (file) => {
    if (!file) return;
    
    // Create object URL for display
    const imageUrl = URL.createObjectURL(file);
    
    setMessages(prev => [
      ...prev, 
      { sender: 'user', isImage: true, imageUrl },
      { sender: 'bot', text: "Thank you for the eye image. Analyzing now..." }
    ]);
    
    setShowImageUpload(false);
    setIsAnalyzing(true);

    try {
      // Convert image to base64 for analysis
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Analyze image through backend
      const { explanation, requestsDoctors } = await analyzeImageWithAI(base64Image);
      
      // Update messages with analysis
      setMessages(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: explanation,
          isAnalysis: true 
        }
      ]);

      // Handle doctor recommendations if needed
      if (requestsDoctors) {
        setPendingDoctorRequest(explanation);
        setShowDoctorPrompt(true);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setMessages(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: "Sorry, we encountered an error analyzing your image. Please try again or consult an eye doctor."
        }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const navigate = useNavigate();
  const homepage = () => {
    navigate('/');
  };

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <div className={`chatbot ${darkMode ? 'dark' : ''}`}>
        <div className="chat-container">
          <div className="chat-header">
            <div className="header-left" onClick={() => homepage()}>
              <img src={logo} alt="OphthoAI Logo" className="logo-img"/>
              <h2>BetterSight</h2>
            </div>
            <div className="header-right">
              <div className="user-avatar">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User profile" />
                ) : (
                  <div className="avatar-fallback">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <button className="theme-toggle" onClick={toggleTheme}>
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              <button className="clear-chat-btn" onClick={handleClearChat}>
                <FaTrash />
              </button>
              <button className="logout-btn" onClick={onLogout}>
                <FaSignOutAlt />
              </button>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender} ${msg.isAnalysis ? 'analysis' : ''}`}>
                {msg.isImage ? (
                  <div className="image-message">
                    <img src={msg.imageUrl} alt="User uploaded eye" className="eye-image" />
                    <div className="image-caption">Eye photo submitted</div>
                  </div>
                ) : (
                  <div className="message-content">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            
            {showDoctorPrompt && (
              <div className="doctor-prompt">
                <p>Would you like me to show nearby eye specialists?</p>
                <div className="prompt-buttons">
                  <button onClick={() => handleShowDoctors(true)}>
                    <FaCheck /> Yes, please
                  </button>
                  <button onClick={() => handleShowDoctors(false)}>
                    <FaTimes /> Not now
                  </button>
                </div>
              </div>
            )}
            
            {doctorResults && (
              <div className="doctor-results">
                <div className="doctors-list">
                  {doctorResults.map((doctor, index) => (
                    <div key={index} className="doctor-card">
                      <h4>{doctor.name}</h4>
                      <p><strong>Specialty:</strong> {doctor.specialty}</p>
                      <p><strong>Address:</strong> {doctor.address}</p>
                      <p><strong>Distance:</strong> {doctor.distance}</p>
                      <p><strong>Phone:</strong> {doctor.phone}</p>
                    </div>
                  ))}
                </div>
                {mapUrl && (
                  <div className="map-container">
                    <iframe
                      title="Eye Specialists Near You"
                      width="100%"
                      height="300"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={mapUrl}
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}
            
            {(isTyping || isAnalyzing) && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-area">
            {showImageUpload && !isAnalyzing && (
              <div className="file-upload-container">
                <label htmlFor="eye-upload" className="upload-button">
                  <FaCamera /> Upload Eye Photo
                </label>
                <input 
                  id="eye-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleEyePhotoUpload(e.target.files[0])}
                  disabled={isTyping || isAnalyzing}
                />
              </div>
            )}
            
            <div className="text-input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isAnalyzing && handleSendMessage()}
                placeholder="Ask about eye health or vision concerns..."
                disabled={isTyping || isAnalyzing}
              />
              <button 
                onClick={handleSendMessage} 
                disabled={isTyping || isAnalyzing || !inputMessage.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;