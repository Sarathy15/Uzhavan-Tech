import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-green"></div>
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
