import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.svg';
import doctor from '../../assets/doctor.png';
import './HeroSection.css';

const HeroSection = ({ user, handleGoogleLogin, toggleChatbot }) => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="hero-section">
      {/* Background elements first, with lower z-index */}
      <div className="hero-background-elements">
        <motion.div 
          className="floating-circle large"
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-circle medium"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="floating-circle largegb"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="floating-circle small"
          animate={{
            y: [0, 25, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Rest of the content with higher z-index */}
      <div className="hero-content-wrapper">
        <nav className="navbar" data-aos="fade-down">
          <div className="logo" data-aos="fade-dowm" data-aos-delay="200">
            <img src={logo} alt="BetterSight Logo" />
            <span>BetterSight</span>
          </div>
          {user ? (
            <button onClick={toggleChatbot} className="profile-button">
              <img src={user.photoURL} alt="User Profile" className="profile-pic" />
            </button>
          ) : (
            <button onClick={handleGoogleLogin} className="cta-button">
              Get Started
            </button>
          )}
        </nav>

        <div className="hero-banner">
          <div className="hero-content" data-aos="fade-up">
            <h1 data-aos="fade-up" data-aos-delay="100">
              Your Personal <span>Ophthalmology Assistant</span>
            </h1>
            <p data-aos="fade-up" data-aos-delay="200">
              BetterSight harnesses cutting-edge artificial intelligence to provide comprehensive eye
              health analysis, personalized recommendations, and instant access to ophthalmology
              expertise — all from the comfort of your home.
            </p>
            {!user && (
              <div className="hero-buttons">
                <button onClick={handleGoogleLogin} className="primary-button">
                  Try Now
                </button>
              </div>
            )}
          </div>
          <div className="hero-image">
            <img src={doctor} alt="AI Doctor analyzing eye health" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;