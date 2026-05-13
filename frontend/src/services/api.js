import axios from 'axios';

// If in development (Vite), use the proxy. In production, use the current origin.
const API_URL = '/api';

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const getDownloadUrl = (token) => {
  // Return the direct backend API URL for the browser to trigger a download
  return `${API_URL}/download/${token}`;
};
