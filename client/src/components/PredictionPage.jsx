import React, { useState } from 'react';
import axios from 'axios';
import './PredictionPage.css';

const PredictionPage = ({ user, modelType, title, description }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState('');

  const API_URL = `https://nil360-retinal-disease-api.hf.space/predict/${modelType}/`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPredictionResult(null);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPredictionResult(response.data);
    } catch (err) {
      setError('Error processing your image. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultItem = (key, value) => {
    // Skip confidence for Diabetic Retinopathy
    if (modelType === 'dr' && key === 'confidence') {
      return null;
    }
    
    return (
      <div key={key} className="result-item">
        <span className="result-key">
          {key === 'class' ? 'Result' : key.charAt(0).toUpperCase() + key.slice(1)}:
        </span>
        <span className="result-value">
          {typeof value === 'number' ? (value * 100).toFixed(2) + '%' : value.toString()}
        </span>
      </div>
    );
  };

  return (
    <div className="prediction-page">
      <div className="prediction-container">
        <h2>{title}</h2>
        <p className="description">{description}</p>
        
        <div className="upload-section">
          <form onSubmit={handleSubmit}>
            <div className="file-input-container">
              <input 
                type="file" 
                id="retinal-image" 
                accept="image/*" 
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="retinal-image" className="file-label">
                {selectedFile ? 'Change Image' : 'Select Retinal Image'}
              </label>
              {selectedFile && <span className="file-name">{selectedFile.name}</span>}
            </div>
            
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Retinal preview" />
              </div>
            )}
            
            <button 
              type="submit" 
              className="predict-button"
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? 'Processing...' : 'Analyze Image'}
            </button>
          </form>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {predictionResult && (
          <div className="result-section">
            <h3>Analysis Results</h3>
            <div className="result-details">
              {Object.entries(predictionResult).map(([key, value]) => {
                let displayValue = '';

                if (typeof value === 'object' && value !== null && 'class' in value) {
                  displayValue = value.class;
                } else if (typeof value === 'number') {
                  displayValue = (value * 100).toFixed(2) + '%';
                } else {
                  displayValue = value.toString();
                }

                return (
                  <div key={key} className="result-item">
                    <span className="result-key">{key}:</span>
                    <span className="result-value">{displayValue}</span>
                  </div>
                );
              })}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;