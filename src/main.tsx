import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { measureWebVitals } from './utils/performance';
import { SWRConfig } from 'swr';

// Measure performance metrics
measureWebVitals((metric) => {
  // In production, you would send this to your analytics service
  if (import.meta.env.PROD) {
    console.log(metric);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SWRConfig 
        value={{
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          dedupingInterval: 300000
        }}
      >
        <App />
      </SWRConfig>
    </ErrorBoundary>
  </React.StrictMode>,
);