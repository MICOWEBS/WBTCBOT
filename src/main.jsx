import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Add this to your index.css or create a new file for theme styles
const themeStyles = `
  :root {
    color-scheme: light dark;
  }

  .light {
    --bg-primary: #ffffff;
    --bg-secondary: #f3f4f6;
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
  }

  .dark {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
  }
`;

// Add the theme styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = themeStyles;
document.head.appendChild(styleSheet);

// Create a wrapper component to handle provider initialization
function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
); 