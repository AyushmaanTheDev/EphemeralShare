import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDownloadUrl } from '../services/api';
import { Download, AlertTriangle, FileQuestion, ArrowLeft } from 'lucide-react';

const DownloadPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = () => {
    setDownloading(true);
    setError(null);
    
    // We navigate to the backend download URL directly to let the browser handle the file stream
    const downloadUrl = getDownloadUrl(token);
    
    // Create an invisible iframe or anchor to trigger the download without leaving the page
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = ''; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // After triggering download, we assume it's gone and update UI.
    // The backend handles the actual 410 / deletion.
    setTimeout(() => {
      setDownloading(false);
      // We purposefully let the user see the error if they try to click it again
    }, 2000);
  };

  return (
    <div className="card animate-fade-in text-center">
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
        <FileQuestion size={64} color="var(--primary)" />
      </div>
      
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Secure File Ready</h2>
      
      <div className="badge badge-warning mb-4">
        <AlertTriangle size={16} /> This file will be deleted permanently after download.
      </div>
      
      <p className="text-muted mb-4">
        You have been sent a secure, single-use file link. Make sure you are ready to save the file, as this link will not work a second time.
      </p>

      {error && (
        <div className="badge badge-danger mb-4" style={{ width: '100%', justifyContent: 'center' }}>
          {error}
        </div>
      )}

      <button 
        className="btn" 
        onClick={handleDownload} 
        disabled={downloading}
      >
        {downloading ? 'Starting Download...' : (
          <>
            <Download size={20} /> Download File Now
          </>
        )}
      </button>

      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-muted)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' 
          }}
        >
          <ArrowLeft size={16} /> Back to Upload
        </button>
      </div>
    </div>
  );
};

export default DownloadPage;
