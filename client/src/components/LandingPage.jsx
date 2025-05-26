// LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../components/Login';
import './LandingPage.css';
import logo from '../assets/logo.svg';
import doctor from '../assets/doctor.png';
import robot from '../assets/robot.png';
import banner from '../assets/banner.png';

function LandingPage({ setUser }) {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const userData = await signInWithGoogle();
      setUser(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="BetterSight Logo" />
            <span>BetterSight</span>
          </div>
          <button onClick={handleGoogleLogin} className="cta-button">Get Started</button>
        </nav>
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Your Personal <span>Ophthalmology Assistant</span></h1>
            <p>BetterSight harnesses cutting-edge artificial intelligence to provide comprehensive eye health analysis, personalized recommendations, and instant access to ophthalmology expertise - all from the comfort of your home.</p>
            <div className="hero-buttons">
              <button onClick={handleGoogleLogin} className="primary-button">Try Now</button>
              <a href="#features" className="secondary-button">Learn More</a>
            </div>
          </div>
          <div className="hero-image">
            <img src={doctor} alt="AI Doctor analyzing eye health" />
          </div>
        </div>
      </div>

      <section id="features" className="features-section">
        <h2>How BetterSight Helps You</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-camera-retro"></i></div>
            <h3>Image Analysis</h3>
            <p>Upload eye photos for instant AI-powered analysis of potential conditions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-comment-medical"></i></div>
            <h3>Expert Chat</h3>
            <p>Conversational AI trained specifically in ophthalmology knowledge</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-map-marker-alt"></i></div>
            <h3>Specialist Finder</h3>
            <p>Get recommendations for nearby ophthalmologists with directions</p>
          </div>
          <div className="hero-stats feature-card">
              <div className="stat-item">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Eye Conditions Analyzed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">84%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
            </div>
        </div>
        
      </section>

      <section className="banner-section">
        <img src={banner} alt="BetterSight Banner" className="banner-image" />
      </section>

      <section className="demo-section">
        <div className="demo-content">
          <h2>Experience Our AI in Action</h2>
          <p>See how BetterSight's artificial intelligence can transform your eye care routine with these powerful capabilities:</p>
          <div className="demo-features">
            <div className="demo-feature">
              <i className="fas fa-bolt"></i>
              <span>Instant analysis of eye images</span>
            </div>
            <div className="demo-feature">
              <i className="fas fa-brain"></i>
              <span>Deep learning algorithms</span>
            </div>
            <div className="demo-feature">
              <i className="fas fa-shield-alt"></i>
              <span>HIPAA-compliant security</span>
            </div>
          </div>
          <div className="demo-video">
            <div className="video-placeholder">
              <i className="fas fa-play"></i>
              <img src={robot} alt="AI Robot" className='demo-robot' />
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>Trusted by Users Worldwide</h2>
        <p className="section-subtitle">Join thousands who have transformed their eye care with our AI technology</p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-text">"BetterSight's AI detected early signs of glaucoma that my regular checkup missed. The specialist it recommended confirmed the diagnosis and said early detection saved my vision."</div>
            <div className="testimonial-author">
              <img className="testimonial-avatar" src="https://avatar.iran.liara.run/public/96" alt="User Avatar" />
              <div>
                <h4>Sarah J.</h4>
                <p>New York, USA</p>
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-text">"As a diabetic, I need to monitor my eyes carefully. BetterSight's AI tracks subtle changes between my monthly photos and alerts me to anything concerning before it becomes serious."</div>
            <div className="testimonial-author">
              <img className="testimonial-avatar" src="https://avatar.iran.liara.run/public/11" alt="User Avatar" />
              <div>
                <h4>Michael T.</h4>
                <p>London, UK</p>
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-text">"The AI chat answered all my questions about my child's conjunctivitis at 2AM when no doctor was available. It was accurate, reassuring, and even reminded me when to follow up."</div>
            <div className="testimonial-author">
              <img className="testimonial-avatar" src="https://avatar.iran.liara.run/public/47" alt="User Avatar" />
              <div>
                <h4>Priya K.</h4>
                <p>Mumbai, India</p>
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-text">"As a diabetic, I need to monitor my eyes carefully. BetterSight's AI tracks subtle changes between my monthly photos and alerts me to anything concerning before it becomes serious."</div>
            <div className="testimonial-author">
              <img className="testimonial-avatar" src="https://avatar.iran.liara.run/public/11" alt="User Avatar" />
              <div>
                <h4>Michael T.</h4>
                <p>London, UK</p>
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Experience AI-Powered Eye Care?</h2>
        <p>Join thousands of users who trust BetterSight's artificial intelligence for their ophthalmology needs. Get started in seconds:</p>
        <div className="cta-buttons">
          <button onClick={handleGoogleLogin} className="primary-button large">Start Free Consultation</button>
          <a href="#features" className="secondary-button large">How Our AI Works</a>
        </div>
        <div className="cta-footer">
          <div className="cta-feature">
            <i className="fas fa-lock"></i>
            <span>HIPAA compliant</span>
          </div>
          <div className="cta-feature">
            <i className="fas fa-user-md"></i>
            <span>Doctor-approved</span>
          </div>
          <div className="cta-feature">
            <i className="fas fa-clock"></i>
            <span>24/7 availability</span>
          </div>
        </div>
      </section>


      <footer className="footer">
        <div className="footer-content">
          <div className="footer-about">
            <div className="logo">
              <img src={logo} alt="BetterSight Logo" />
              <span>BetterSight</span>
            </div>
            <p>AI-powered ophthalmology assistant revolutionizing eye care through artificial intelligence and machine learning.</p>
          </div>
         <div className="footer-links">
            <h4>Company</h4>
            <a href="#about">About Our Team</a>
            <a href="#team">Medical Resources</a>
            <a href="#careers">FAQ</a>
            <a href="#press">Support</a>
          </div>
         
          <div className="footer-links">
            <h4>Legal</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#hipaa">HIPAA Compliance</a>
            <a href="#contact">Contact Us</a>
          </div>
          <div className="footer-social">
            <h4>Follow Our AI Journey</h4>
            <div className="social-icons">
              <a href="#twitter"><i className="fab fa-twitter"></i></a>
              <a href="#facebook"><i className="fab fa-facebook"></i></a>
              <a href="#linkedin"><i className="fab fa-linkedin"></i></a>
              <a href="#youtube"><i className="fab fa-youtube"></i></a>
            </div>
            <div className="app-stores">
              <button className="app-store">
                <i className="fab fa-apple"></i>
                <span>App Store</span>
              </button>
              <button className="app-store">
                <i className="fab fa-google-play"></i>
                <span>Google Play</span>
              </button>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} BetterSight. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;