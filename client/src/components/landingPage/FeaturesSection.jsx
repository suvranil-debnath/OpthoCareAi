import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { checkAndConsumeTrial, updateSubscriptionStatus } from '../../utils/trialUtils';
import { SERVER_URL } from '../../main';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './FeaturesSection.css';

const FeaturesSection = ({ toggleChatbot }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [hasTrialsLeft, setHasTrialsLeft] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ophthocare-user'));
    setUser(userData);
    if (userData) {
      checkTrialStatus(userData.uid);
    }
  }, []);
  const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      throw new Error('Failed to load Razorpay script');
    };
    document.body.appendChild(script);
  });
  };

  const checkTrialStatus = async (userId) => {
    try {
      const result = await checkAndConsumeTrial(userId, true); // Check-only mode
      setHasSubscription(result.Subscriber || false);
      setHasTrialsLeft(result.trail_count > 0);
    } catch (error) {
      console.error('Error checking trial status:', error);
    }
  };

  const handlePredictionClick = async (diseaseType) => {
    if (!user) {
      alert('Please login to use this feature');
      return;
    }

    if (hasSubscription) {
      navigate(`/predict/${diseaseType}`);
      return;
    }

    const result = await checkAndConsumeTrial(user.uid);
    if (result.allowed) {
      setHasTrialsLeft(result.trail_count > 0);
      navigate(`/predict/${diseaseType}`);
    } else {
      alert(result.message);
      setHasTrialsLeft(false);
    }
  };

  const initiateSubscription = async () => {
  if (!user) {
    alert('Please login to subscribe');
    return;
  }

  setIsLoading(true);
  try {
    // Load Razorpay script first
    await loadRazorpayScript();

    // Step 1: Create order
    const response = await fetch(`${SERVER_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1899 }), // Your subscription amount
    });

    const orderData = await response.json();

    // Step 2: Open Razorpay checkout
    const options = {
      key: "rzp_test_glhF13Fdod0C1P",
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'OphthoCare',
      description: 'Premium Subscription',
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // Step 3: Verify payment
          const verificationResponse = await fetch(`${SERVER_URL}/api/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verificationData = await verificationResponse.json();
          if (verificationData.success) {
            // Step 4: Update subscription status in Firebase
            await updateSubscriptionStatus(user.uid);
            setHasSubscription(true);
            alert('Subscription successful! You can now access all features.');
          } else {
            alert('Payment verification failed. Please try again.');
          }
        } catch (error) {
          console.error('Payment processing error:', error);
          alert('Error processing payment. Please contact support.');
        }
      },
      prefill: {
        name: user.name || '',
        email: user.email || '',
      },
      theme: {
        color: '#4f46e5',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Subscription error:', error);
    alert('Failed to initiate subscription. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleChatbotClick = async () => {
    if (!user) {
      alert('Please login to use the chatbot');
      return;
    }
    
    if (hasSubscription) {
      toggleChatbot();
      return;
    }

    const result = await checkAndConsumeTrial(user.uid);
    if (result.allowed) {
      setHasTrialsLeft(result.trail_count > 0);
      toggleChatbot();
    } else {
      alert(result.message);
      setHasTrialsLeft(false);
    }
  };

  const handleSpecialistClick = () => {
    if (!user) {
      alert('Please login to find specialists');
      return;
    }
    alert('Specialist finder coming soon!');
  };

  const renderActionButton = (diseaseType) => {
    if (!user) {
      return (
        <button 
          className="primary-button" 
          onClick={() => alert('Please login to use this feature')}
        >
          Try Now
        </button>
      );
    }

    if (hasSubscription) {
      return (
        <button 
          className="primary-button" 
          onClick={() => navigate(`/predict/${diseaseType}`)}
        >
          Let's Go!
        </button>
      );
    }

    if (hasTrialsLeft) {
      return (
        <button 
          className="primary-button" 
          onClick={() => handlePredictionClick(diseaseType)}
        >
          Try Now
        </button>
      );
    }

    return (
      <button 
        className="primary-button" 
        onClick={initiateSubscription}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Subscribe'}
      </button>
    );
  };

  const predictionCards = [
    { id: 'amd', title: 'AMD Detection', description: 'Check for Age-related Macular Degeneration', icon: 'fas fa-eye' },
    { id: 'dr', title: 'Diabetic Retinopathy', description: 'Detect diabetes-related eye damage', icon: 'fas fa-bolt' },
    { id: 'glaucoma', title: 'Glaucoma Screening', description: 'Early glaucoma risk detection', icon: 'fas fa-cloud' },
    { id: 'hypertension', title: 'Hypertension Retinopathy', description: 'Detect eye damage from high blood pressure', icon: 'fas fa-heartbeat' },
    { id: 'cataract', title: 'Cataract Detection', description: 'Identify lens clouding and cataract formation', icon: 'fas fa-glasses' }
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
          interval={5000}
        >
          {predictionCards.map((card) => (
            <div key={card.id} className="prediction-card">
              <div className="feature-icon"><i className={card.icon}></i></div>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
              {renderActionButton(card.id)}
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