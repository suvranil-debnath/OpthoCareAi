import React from 'react';
import './rpg.css';
import guideImage from '../assets/guide.png'; // Make sure the image is in the same folder or update path accordingly

const RetinaPhotoguide = () => {
  return (
    <div className="photoguide-container">
      <div className="guide-header">
        <h2>Smartphone Retina Photography Guide</h2>
        <p>Learn how to capture retinal images at home using your smartphone</p>
      </div>

      <div className="guide-body">
        <div className="guide-image">
          <img src={guideImage} alt="Retina photography demonstration" />
        </div>

        <div className="guide-content">
          <div className="guide-steps">
            <div className="step-card">
              <h3>What You'll Need</h3>
              <ul>
                <li>Smartphone with camera and flash</li>
                <li>20D or 28D condensing lens</li>
                <li>Optional: Pupil dilation drops</li>
                <li>Optional: Phone stand/tripod</li>
              </ul>
            </div>

            <div className="step-card">
              <h3>Step-by-Step Guide</h3>
              <ol>
                <li>Prepare in dim lighting</li>
                <li>Clean phone camera lens</li>
                <li>Hold lens 2-3" from eye</li>
                <li>Position phone 6-10" from lens</li>
                <li>Align and capture image</li>
              </ol>
            </div>
          </div>

          <div className="guide-tips">
            <div className="tips-section">
              <h3>Pro Tips</h3>
              <div className="tip-item">
                <span className="tip-icon">🔍</span>
                <p>Use video mode then extract frames for best results</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <p>Angle flash slightly to reduce reflections</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">✋</span>
                <p>Rest elbows on table for stability</p>
              </div>
            </div>

            <div className="warnings-section">
              <h3>Important Warnings</h3>
              <ul>
                <li>Don't shine light directly for prolonged periods</li>
                <li>Discontinue if experiencing discomfort</li>
                <li>Not a substitute for professional exam</li>
              </ul>
              <button className="professional-help-btn">
                When to Seek Professional Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetinaPhotoguide;
