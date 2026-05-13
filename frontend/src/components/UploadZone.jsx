import React, { useRef, useState } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

const UploadZone = ({ onUpload, isUploading, progress, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file) => {
    if (isUploading) return;
    
    // Quick frontend validation before hitting server
    if (file.size > 50 * 1024 * 1024) {
      alert("File is too large. Maximum size is 50MB.");
      return;
    }
    
    onUpload(file);
  };

  const onButtonClick = () => {
    if (!isUploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="card animate-fade-in">
      <div className="header">
        <h1>
          <UploadCloud size={36} /> EphemeralShare
        </h1>
        <p>Secure, one-time file sharing. Files self-destruct after download or 24 hours.</p>
      </div>

      {error && (
        <div className="badge badge-danger mb-4" style={{ width: '100%', justifyContent: 'center' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          style={{ display: 'none' }}
          onChange={handleChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <>
            <File size={48} className="upload-icon" />
            <div className="upload-text">Uploading...</div>
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-muted text-center">{progress}% completed</div>
            </div>
          </>
        ) : (
          <>
            <UploadCloud size={64} className="upload-icon" />
            <div className="upload-text">Drag & drop a file here</div>
            <div className="upload-hint">or click to browse from your computer (Max 50MB)</div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadZone;
