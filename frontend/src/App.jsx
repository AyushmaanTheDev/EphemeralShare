import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadZone from './components/UploadZone';
import LinkDisplay from './components/LinkDisplay';
import DownloadPage from './components/DownloadPage';
import { useUpload } from './hooks/useUpload';

const Home = () => {
  const { isUploading, progress, error, result, handleUpload, reset } = useUpload();

  return (
    <div className="app-container">
      {!result ? (
        <UploadZone 
          onUpload={handleUpload} 
          isUploading={isUploading} 
          progress={progress} 
          error={error} 
        />
      ) : (
        <LinkDisplay result={result} onReset={reset} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download/:token" element={
          <div className="app-container">
            <DownloadPage />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
