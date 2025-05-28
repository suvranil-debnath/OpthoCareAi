import React from 'react';
import robot from '../../assets/robot.png';
import './DemoSection.css';

const DemoSection = () => (
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
);

export default DemoSection;