import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ErrorState {
  error?: string;
  details?: string;
}

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ErrorState | undefined;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {state?.error || 'Something went wrong'}
          </h1>
          
          {state?.details && (
            <div className="mt-4 p-4 bg-red-50 rounded-md text-left">
              <p className="text-red-700 font-medium">Details:</p>
              <p className="text-red-600 mt-1 text-sm">{state.details}</p>
            </div>
          )}
          
          <div className="mt-8 space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors ml-0 sm:ml-4"
            >
              Go to Home
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Go Back
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>If the problem persists, please contact support with the following information:</p>
            <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
              <p>URL: {window.location.href}</p>
              <p>Timestamp: {new Date().toISOString()}</p>
              {state?.error && <p>Error: {state.error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
