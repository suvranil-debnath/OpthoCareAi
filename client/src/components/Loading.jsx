// components/Loading.js
import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading OphthoCare...</p>
    </div>
  );
};

export default Loading;
