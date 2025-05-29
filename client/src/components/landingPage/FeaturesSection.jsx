import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './FeaturesSection.css';

const FeaturesSection = ({ toggleChatbot }) => {
  const navigate = useNavigate();

  const handleAuthCheck = (callback, message) => {
    const user = JSON.parse(localStorage.getItem('ophthocare-user'));
    if (!user) {
      alert(message);
      return;
    }
    callback();
  };

  const handlePredictionClick = (diseaseType) => {
    handleAuthCheck(() => navigate(`/predict/${diseaseType}`), 'Please login to use this feature');
  };

  const handleChatbotClick = () => {
    handleAuthCheck(() => toggleChatbot(), 'Please login to use the chatbot');
  };

  const handleSpecialistClick = () => {
    handleAuthCheck(() => alert('Specialist finder coming soon!'), 'Please login to find specialists');
  };

  const predictionCards = [
    { id: 'amd', title: 'AMD Detection', description: 'Check for Age-related Macular Degeneration', icon: 'fas fa-eye' },
    { id: 'dr', title: 'Diabetic Retinopathy', description: 'Detect diabetes-related eye damage', icon: 'fas fa-bolt' },
    { id: 'glaucoma', title: 'Glaucoma Screening', description: 'Early glaucoma risk detection', icon: 'fas fa-cloud' },
    { id: 'hypertension', title: 'Hypertension Retinopathy', description: 'Detect eye damage from high blood pressure', icon: 'fas fa-heartbeat' }
];

  return (
    <section id="features" className="features-section">
      <h2>BetterSight Features</h2>

      <div className="prediction-carousel-container">
        <h3 className="prediction-subtitle">AI-powered Retinal Disease Detection</h3>
        <Carousel
          showArrows
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button type="button" onClick={onClickHandler} className="carousel-arrow left" aria-label={label}>
                <i className="fas fa-chevron-left"></i>
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button type="button" onClick={onClickHandler} className="carousel-arrow right" aria-label={label}>
                <i className="fas fa-chevron-right"></i>
              </button>
            )
          }
          showStatus={false}
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={3000}
        >
          {predictionCards.map((card) => (
            <div key={card.id} className="prediction-card" onClick={() => handlePredictionClick(card.id)}>
              <div className="feature-icon"><i className={card.icon}></i></div>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
              <button className="primary-button">Try Now</button>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="features-grid">
        <div className="feature-card" onClick={handleChatbotClick}>
          <div className="feature-icon"><i className="fas fa-comment-medical"></i></div>
          <h4>Expert Chat</h4>
          <p>Talk to a smart AI trained in eye care.</p>
        </div>
        <div className="feature-card" onClick={handleSpecialistClick}>
          <div className="feature-icon"><i className="fas fa-map-marker-alt"></i></div>
          <h4>Specialist Finder</h4>
          <p>Locate top ophthalmologists nearby.</p>
        </div>
        <div className="feature-card stats-card">
          <div className="stat-item">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Scans Analyzed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">84%</span>
            <span className="stat-label">Prediction Accuracy</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
