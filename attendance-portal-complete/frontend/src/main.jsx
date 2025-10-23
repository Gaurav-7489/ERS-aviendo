import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider
    publishableKey={clerkPubKey}
    navigate={(to) => window.history.pushState(null, '', to)}
  >
    <App />
  </ClerkProvider>
);
