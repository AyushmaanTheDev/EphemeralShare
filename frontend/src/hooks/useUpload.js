import { useState, useCallback } from 'react';
import { uploadFile } from '../services/api';

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = useCallback(async (file) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const response = await uploadFile(file, (percent) => {
        setProgress(percent);
      });
      setResult(response.data);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(
        err.response?.data?.message || 'An error occurred during upload. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setResult(null);
  };

  return {
    isUploading,
    progress,
    error,
    result,
    handleUpload,
    reset,
  };
};
