import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import Web3 from 'web3';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
        } catch (error) {
          alert("MetaMask connection failed. Please try again.");
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    
    const getCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/csrf/', { withCredentials: true });
        console.log('Response Headers:', response.headers); // Log response headers to check cookies
        const csrfToken = response.data.csrftoken || response.headers['X-CSRFToken'];
        console.log(`CSRF Token fetched: ${csrfToken}`);
        if (csrfToken) {
          axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
          axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
          document.cookie = `csrftoken=${csrfToken}`
          console.log(`CSRF Token on load: ${csrfToken}`);
        } else {
          throw new Error('CSRF token not found in response.');
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    loadWeb3();
    getCsrfToken();
  }, []);

  const handleLoginWithWallet = async () => {
    if (!web3) {
      alert("Web3 not available. Please connect to MetaMask.");
      return;
    }

    try {
      setLoading(true);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        setError("No accounts found in MetaMask. Please connect your wallet.");
        return;
      }

      const userWallet = accounts[0];
      const message = "I am signing in";
      const signature = await web3.eth.personal.sign(message, userWallet, "");

      

      const csrfToken = getCookie("csrftoken");
      if (!csrfToken) {
        setError("CSRF token not found");
        return;
      }

      const payload = { wallet: userWallet, signature: signature };
      const response = await axios.post(
        "http://localhost:8000/api/authorize/",
        payload,
        { headers: { 'X-CSRFToken': csrfToken }, withCredentials: true }
      );

      if (response.data.success) {
        const tokenData = response.data.token; // This is your full token object
        // Extract the access token and store it
        if (tokenData) {
          localStorage.setItem("access_token", tokenData.access);
          localStorage.setItem('refresh_token', tokenData.refresh);
          localStorage.setItem("wallet_address", userWallet);
          console.log(localStorage.getItem('access_token'))
          navigate("/home");
        } else {
          setError("Access token is undefined");
        }
      } else {
        setError("Authorization failed");
      }
    } catch (error) {
      setError("Error during wallet login");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function getCookie(name: string) {
    let cookieValue = null;
    const allCookies = document.cookie;
    if (allCookies && allCookies !== '') {
      const cookies = allCookies.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Typography color="error" gutterBottom>{error}</Typography>}
      <Button variant="contained" color="secondary" onClick={handleLoginWithWallet} disabled={loading} sx={{ marginTop: 2 }}>
        {loading ? <CircularProgress size={24} /> : 'Login with Wallet'}
      </Button>
    </Box>
  );
};

export default Login;
