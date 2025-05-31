import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import LandingPage from './components/LandingPage';
import PredictionPage from './components/PredictionPage'; // New component
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('ophthocare-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem('ophthocare-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ophthocare-user');
    setShowChatbot(false);
  };

  const toggleChatbot = () => {
    if (user) {
      setShowChatbot(!showChatbot);
    } else {
      alert('Please login to use the chatbot');
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <LandingPage 
                  user={user}
                  setUser={handleSetUser} 
                  toggleChatbot={toggleChatbot} 
                />
                {showChatbot && user && (
                  <div className="chatbot-floating-container">
                    <FullScreenButton user={user} />
                    <Chatbot user={user} onLogout={handleLogout} onClose={() => setShowChatbot(false)} />
                  </div>
                )}
              </>
            } 
          />
          <Route 
            path="/chatbot" 
            element={
              user ? (
                <div className="chatbot-fullscreen-container">
                  <Chatbot user={user} onLogout={handleLogout} onClose={() => window.history.back()} />
                </div>
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          {/* New prediction routes */}
          <Route 
            path="/predict/amd" 
            element={
              user ? (
                <PredictionPage 
                  user={user} 
                  modelType="amd" 
                  title="AMD Detection" 
                  description="Upload retinal image to check for Age-related Macular Degeneration"
                />
              ) : (
                <Navigate to="/" state={{ from: '/predict/amd' }} />
              )
            } 
          />
          <Route 
            path="/predict/dr" 
            element={
              user ? (
                <PredictionPage 
                  user={user} 
                  modelType="dr" 
                  title="Diabetic Retinopathy Detection" 
                  description="Upload retinal image to check for Diabetic Retinopathy"
                />
              ) : (
                <Navigate to="/" state={{ from: '/predict/dr' }} />
              )
            } 
          />
          <Route 
            path="/predict/glaucoma" 
            element={
              user ? (
                <PredictionPage 
                  user={user} 
                  modelType="glaucoma" 
                  title="Glaucoma Detection" 
                  description="Upload retinal image to check for Glaucoma"
                />
              ) : (
                <Navigate to="/" state={{ from: '/predict/glaucoma' }} />
              )
            } 
          />
          <Route 
            path="/predict/hypertension" 
            element={
              user ? (
                <PredictionPage 
                  user={user} 
                  modelType="hypertension" 
                  title="Hypertension Retinopathy" 
                  description="Detect eye damage from high blood pressure"
                />
              ) : (
                <Navigate to="/" state={{ from: '/predict/hypertension' }} />
              )
            } 
          />
          <Route 
            path="/predict/cataract" 
            element={
              user ? (
                <PredictionPage 
                  user={user} 
                  modelType="cataract" 
                  title="Cataract Detection" 
                  description="Identify lens clouding and cataract formation"
                />
              ) : (
                <Navigate to="/" state={{ from: '/predict/hypertension' }} />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Separate component for the full-screen button
function FullScreenButton({ user }) {
  const navigate = useNavigate();

  const goFullScreen = () => {
    navigate('/chatbot');
  };

  return (
    <button className="chatbot-full-button" onClick={goFullScreen} title="Fullscreen">
      <i className="fas fa-expand"></i>
    </button>
  );
}

export default App;