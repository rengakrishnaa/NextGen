import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext'; // Import only AuthContext

const Navbar: React.FC = () => {
  const context = useContext(AuthContext);

  // Ensure context is defined
  if (!context) {
    throw new Error('Navbar must be used within an AuthProvider');
  }

  const { user, logout } = context; // Get user and logout function from context

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Next-Gen Governance
        </Typography>
        {user ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" href="/login"> {/* Redirect to login page */}
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
