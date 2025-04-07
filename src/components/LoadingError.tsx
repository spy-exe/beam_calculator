import React from 'react';

interface LoadingProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingProps> = ({ message = "Calculando..." }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-r-4 border-b-4 border-l-transparent mb-4"></div>
    <p className="text-gray-600 text-lg">{message}</p>
  </div>
);

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <div className="flex items-center">
      <strong className="font-bold mr-2">Erro! </strong>
      <span className="block sm:inline">{message}</span>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  </div>
);