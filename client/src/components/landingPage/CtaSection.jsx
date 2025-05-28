import React from 'react';
import './CtaSection.css';

const CtaSection = ({ handleGoogleLogin, user }) => (
  <section className="cta-section">
    <h2>Ready to Experience AI-Powered Eye Care?</h2>
    <p>Join thousands of users who trust BetterSight's artificial intelligence for their ophthalmology needs. Get started in seconds:</p>
    <div className="cta-buttons">
      {!user && (
        <button onClick={handleGoogleLogin} className="primary-button large">Start Free Consultation</button>
      )}
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
);

export default CtaSection;
