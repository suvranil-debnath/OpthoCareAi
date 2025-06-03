import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import './PredictionPage.css';
import { SERVER_URL } from '../main';
import RetinaPhotoGuide from './RetinaPhotoGuide';



const PredictionPage = ({ user, modelType, title, description }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPrescription, setIsGeneratingPrescription] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [rawResult, setRawResult] = useState(null);
  const [error, setError] = useState('');

  const API_URL = `https://nil360-retinal-disease-api.hf.space/predict/${modelType}/`;
  const PRESCRIPTION_API_URL = `${SERVER_URL}/api/single-prompt`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrescription(null);
      setRawResult(null);
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
      // Step 1: Get raw prediction result
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRawResult(response.data);
      
      // Step 2: Generate prescription from the result
      await generatePrescription(response.data);

    } catch (err) {
      setError('Error processing your image. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePrescription = async (resultData) => {
    setIsGeneratingPrescription(true);
    try {
      // Extract the disease name from the result
      let diseaseName = '';
      if (resultData.class) {
        diseaseName = resultData.class;
      } else if (resultData.result) {
        diseaseName = resultData.result;
      } else if (typeof resultData === 'object') {
        diseaseName = Object.entries(resultData)
          .filter(([key, value]) => key !== 'confidence' && typeof value !== 'number')
          .map(([key, value]) => value)
          .join(', ');
      }

      if (!diseaseName) {
        throw new Error('Could not determine disease name from analysis');
      }

      // Get formatted prescription from your API
      const prescriptionResponse = await axios.post(PRESCRIPTION_API_URL, {
        addon: diseaseName
      });

      setPrescription(prescriptionResponse.data.text);
    } catch (err) {
      setError('Error generating prescription. Please try again.');
      console.error('Prescription generation error:', err);
    } finally {
      setIsGeneratingPrescription(false);
    }
  };

const downloadPrescription = async () => {
  const content = document.getElementById('prescriptionExport');
  if (!content) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // HEADER
  doc.setFontSize(20);
  doc.setTextColor(40, 53, 147);
  doc.text('Eye Care Prescription', pageWidth / 2, 20, { align: 'center' });

  // Divider
  doc.setDrawColor(40, 53, 147);
  doc.setLineWidth(0.5);
  doc.line(margin, 25, pageWidth - margin, 25);

  // PATIENT INFO
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Patient: ${user?.displayName || 'User'}`, margin, 35);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, 45);

  // CAPTURE HTML CONTENT
  const canvas = await html2canvas(content, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgProps = doc.getImageProperties(imgData);
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  const yPosition = 55;

  if (yPosition + imgHeight > pageHeight - 20) {
    // If content doesn't fit on one page
    doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, pageHeight - yPosition - 20);
    doc.addPage();
    doc.addImage(imgData, 'PNG', margin, 20, imgWidth, imgHeight);
  } else {
    doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
  }

     // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This is not a substitute for professional medical advice. Please consult an eye specialist.', 105, 280, { align: 'center' });
    

  // SAVE
  doc.save(`Eye_Prescription_${new Date().toISOString().slice(0, 10)}.pdf`);
};


  return (
    <>
    
    <div className="prediction-page">
      <RetinaPhotoGuide/>
      <div className="prediction-container">
        <h2 className='predtitle'>{title}</h2>
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
              {isLoading ? (
                <>
                  <span className="predspinner"></span>
                  Processing...
                </>
              ) : 'Analyze Image'}
            </button>
          </form>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {(isLoading || isGeneratingPrescription) && (
          <div className="loading-message">
            {isGeneratingPrescription ? 'Generating prescription...' : 'Analyzing image...'}
          </div>
        )}
        
        {prescription && (
          <div className="prescription-section">
            <div className="prescription-header">
              <h3>AI's Prescription</h3>
              <button 
                onClick={downloadPrescription}
                className="download-button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
              </button>
            </div>
            <div id="prescriptionExport" className="prescription-conten">
              <ReactMarkdown>{prescription}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default PredictionPage;