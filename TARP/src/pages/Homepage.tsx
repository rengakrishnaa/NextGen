import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import ServiceCard from '../Components/ServiceCard';
import { Box } from '@mui/material';
import axios from 'axios';

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/signup');  // Redirect to signup if not authenticated
    }
  }, [navigate]);

  const services = [
    { id: 1, title: "Passport Service", description: "Apply for a new passport." },
    { id: 2, title: "Driving License", description: "Apply for a new driving license." },
    { id: 3, title: "ID Card", description: "Get a new ID card." },
    { id: 4, title: "Vehicle Registration", description: "Register your vehicle." },
  ];

  // Function to handle Apply button click
  const handleApplyClick = async () => {
    const walletAddress = localStorage.getItem('wallet_address');
    if (!walletAddress) {
      console.error("Wallet address not found in localStorage.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/user-details/${walletAddress}/`,
        // { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );
      console.log("User Details:", response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            padding: '30px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              onApply={handleApplyClick} // Pass the function to ServiceCard
            />
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Homepage;