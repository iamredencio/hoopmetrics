import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { measureWebVitals } from './utils/performance';

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
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);