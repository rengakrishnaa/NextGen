import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Box } from '@mui/material';
import axios from 'axios';

interface UserDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const Sidebar: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCsrfToken = () => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))?.split('=')[1];
    if (!csrfToken) console.warn('CSRF token not found');
    return csrfToken;
  };

  const fetchUserDetails = async () => {
    console.log("fetchUserDetails function called");
  
    const token = localStorage.getItem('access_token'); // Ensure this is the correct token
    const walletAddress = localStorage.getItem('wallet_address');
    console.log("Token taken:", token, "Wallet Address:", walletAddress);
  
    if (!token || !walletAddress) {
      setError('No token or wallet address found');
      setIsLoading(false);
      return;
    }
  
    try {
      const csrfToken = getCsrfToken();
      console.log("CSRF Token:", csrfToken);
  
      const response = await axios.get<UserDetails>(`http://localhost:8000/api/user-details/${walletAddress}/`, {
        // headers: {
        //   'Authorization': `Bearer ${token}`, // Ensure correct token format
        //   'X-CSRFToken': csrfToken,
        //   'Content-Type': `application/json`,
        // },
        withCredentials: true,
      });
      
      console.log("Response Data:", response.data);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <Box
      sx={{
        width: '250px',
        padding: '20px',
        borderRight: '2px solid gray',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
      }}
    >
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Avatar sx={{ width: 100, height: 100 }} />
          <Typography variant="h6" align="center">
            {userDetails?.name || 'Name'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography>Phone: {userDetails?.phone || 'Phone'}</Typography>
            <Typography>Email: {userDetails?.email || 'Email'}</Typography>
            <Typography>Address: {userDetails?.address || 'Address'}</Typography>
            
          </Box>
        </>
      )}
    </Box>
  );
};

export default Sidebar;
