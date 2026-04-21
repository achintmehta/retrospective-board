import React from 'react';

export function renderTextWithImages(text) {
  if (!text) return null;
  
  // Match auto-inserted image tokens: [Image: /uploads/img.png]
  const imageRegex = /(\[Image:\s*.*?\])/g;
  const parts = text.split(imageRegex);
  
  return parts.map((part, index) => {
    const match = part.match(/^\[Image:\s*(.*?)\]$/);
    if (match) {
      // The alt text might be derived or empty, we'll extract the URL
      const url = match[1];
      const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';
      const fullUrl = url.startsWith('/') ? `${SERVER_URL}${url}` : url;
      return (
        <img 
          key={index} 
          src={fullUrl} 
          alt="embedded" 
          className="inline-markdown-image" 
        />
      );
    }

    
    return part ? <span key={index}>{part}</span> : null;
  });
}
