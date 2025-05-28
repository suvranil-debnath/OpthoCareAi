import React from 'react';
import logo from '../../assets/logo.svg';
import doctor from '../../assets/doctor.png';
import './HeroSection.css';

const HeroSection = ({ user, handleGoogleLogin, toggleChatbot }) => (
  <div className="hero-section">
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="BetterSight Logo" />
        <span>BetterSight</span>
      </div>
      {user ? (
        <button onClick={toggleChatbot} className="profile-button">
          <img src={user.photoURL} alt="User Profile" className="profile-pic" />
        </button>
      ) : (
        <button onClick={handleGoogleLogin} className="cta-button">Get Started</button>
      )}
    </nav>
    <div className="hero-banner">
      <div className="hero-content">
        <h1>Your Personal <span>Ophthalmology Assistant</span></h1>
        <p>BetterSight harnesses cutting-edge artificial intelligence to provide comprehensive eye health analysis, personalized recommendations, and instant access to ophthalmology expertise - all from the comfort of your home.</p>
        {!user && (
          <div className="hero-buttons">
            <button onClick={handleGoogleLogin} className="primary-button">Try Now</button>
            <a href="#features" className="secondary-button">Learn More</a>
          </div>
        )}
      </div>
      <div className="hero-image">
        <img src={doctor} alt="AI Doctor analyzing eye health" />
      </div>
    </div>
  </div>
);

export default HeroSection;