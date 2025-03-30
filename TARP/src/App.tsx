import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ServicePage from './pages/ServicePage';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Signup from './Components/Signup';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Login';
// import AppRouter from './Components/AppRouter';

const App: React.FC = () => {
  return (
    <AuthProvider> {/* Wrap your routes with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            } 
          />
          <Route path="/service/:id" element={<ServicePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
