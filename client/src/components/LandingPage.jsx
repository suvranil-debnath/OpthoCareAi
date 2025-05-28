import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../components/Login';
import './LandingPage.css';
import HeroSection from './landingPage/HeroSection';
import FeaturesSection from './landingPage/FeaturesSection';
import BannerSection from './landingPage/BannerSection';
import DemoSection from './landingPage/DemoSection';
import TestimonialsSection from './landingPage/TestimonialsSection';
import CtaSection from './landingPage/CtaSection';
import Footer from './landingPage/Footer';

function LandingPage({ user, setUser, toggleChatbot }) {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const userData = await signInWithGoogle();
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="landing-page">
      <HeroSection user={user} handleGoogleLogin={handleGoogleLogin} toggleChatbot={toggleChatbot} />
      <FeaturesSection />
      <BannerSection />
      <DemoSection />
      <TestimonialsSection />
      {!user && <CtaSection handleGoogleLogin={handleGoogleLogin} />}
      <Footer />
      
      {/* Floating Chatbot Button */}
      {user && (
        <button 
          className="floating-chatbot-button"
          onClick={toggleChatbot}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default LandingPage;