import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Homepage from './Homepage';
import ServicePage from './ServiceDetail';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protect the /signup and /home routes */}
        <Route path="/signup" element={<PrivateRoute element={<Signup />} />} />
        <Route path="/home" element={<PrivateRoute element={<Homepage />} />} />
        
        <Route path="/service/:id" element={<ServicePage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

