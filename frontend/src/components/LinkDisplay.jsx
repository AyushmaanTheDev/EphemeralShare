import React, { useState } from 'react';
import { Copy, CheckCircle2, ShieldCheck, Clock, Download } from 'lucide-react';

const LinkDisplay = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  // In production, the share URL might need adjusting to point to the frontend, 
  // but we return the full correct URL from the backend response.
  // Wait, our backend returned `shareUrl` which we can use directly.
  
  // Format the expiry date
  const expiryDate = new Date(result.expiresAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const handleCopy = () => {
    // Generate the frontend URL. 
    // Assuming backend returned a token, we construct the URL here so it matches the frontend's origin.
    const frontendShareUrl = `${window.location.origin}/download/${result.token}`;
    
    navigator.clipboard.writeText(frontendShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const frontendShareUrl = `${window.location.origin}/download/${result.token}`;

  return (
    <div className="card animate-fade-in">
      <div className="text-center mb-4">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <CheckCircle2 size={64} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Upload Complete!</h2>
        <p className="text-muted">Your file is secure and ready to share.</p>
      </div>

      <div className="file-info">
        <div className="file-info-icon">
          <Download size={24} />
        </div>
        <div className="file-details">
          <div className="file-name">{result.originalName}</div>
          <div className="file-meta">{formatBytes(result.size)}</div>
        </div>
      </div>

      <div className="link-display">
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="badge badge-success">
            <ShieldCheck size={16} /> One-time download
          </div>
          <div className="badge badge-warning">
            <Clock size={16} /> Expires: {expiryDate}
          </div>
        </div>

        <div className="link-box">
          <input 
            type="text" 
            className="link-input" 
            value={frontendShareUrl} 
            readOnly 
            onClick={(e) => e.target.select()}
          />
          <button 
            className="icon-btn" 
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle2 size={20} color="var(--success)" /> : <Copy size={20} />}
          </button>
        </div>
        
        <p className="text-sm text-muted mb-4">
          Warning: This link will expire immediately after the first successful download.
        </p>

        <button className="btn" onClick={onReset} style={{ marginTop: '1rem' }}>
          Upload Another File
        </button>
      </div>
    </div>
  );
};

export default LinkDisplay;
