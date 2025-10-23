import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProfileForm from './pages/ProfileForm';
import Classroom from './pages/Classroom';
import TeacherView from './pages/TeacherView';
import Info from './pages/Info';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <SignedIn>
          <div className="absolute top-4 right-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <Routes>
          <Route path="/" element={<Welcome />} />
          {/* catch all /auth routes including sso callback */}
          <Route path="/auth/*" element={<Auth />} /> 
          <Route path="/dashboard" element={<SignedIn><Dashboard /></SignedIn>} />
          <Route path="/profile" element={<SignedIn><ProfileForm /></SignedIn>} />
          <Route path="/classroom" element={<SignedIn><Classroom /></SignedIn>} />
          <Route path="/teacher" element={<SignedIn><TeacherView /></SignedIn>} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
