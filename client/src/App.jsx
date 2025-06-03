import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Chatbot from './components/Chatbot';
import LandingPage from './components/LandingPage';
import PredictionPage from './components/PredictionPage';
import './App.css';
import Loading from './components/Loading';

const App = () => {
  const [user, setUser] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ophthocare-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem('ophthocare-user', JSON.stringify(userData));
     window.location.reload(); 
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
      toast.error('Please login to use the chatbot');
    }
  };

  return (
    <>
      <div className="mainwrap">
        <ToastContainer position="top-center" autoClose={3000} />
        {loading ? (
          <Loading />
        ) : (
          <BrowserRouter>
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

              {/* Prediction Routes */}
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
                    <Navigate to="/" state={{ from: '/predict/cataract' }} />
                  )
                } 
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        )}
      </div>
    </>
  );
};

// Fullscreen button component
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
