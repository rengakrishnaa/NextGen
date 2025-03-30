import React from 'react';
import { Box, Typography, Checkbox, Button, TextField } from '@mui/material';

interface Document {
  name: string;
  available: boolean;
}

interface UserDetails {
  adhaar: string;
  pan: string;
  bank: string;
  personalDetails: string;
}

const documents: Document[] = [
  { name: 'Adhaar Card', available: false },
  { name: 'PAN Card', available: false },
  { name: 'Bank Details', available: false },
];

const ServiceDetails: React.FC = () => {
  // Mock user details
  const userDetails: UserDetails = {
    adhaar: '1234-5678-9012',
    pan: 'ABCDE1234F',
    bank: 'Bank of India, Acc: 1234567890',
    personalDetails: 'John Doe, 123 Main St, City, Country',
  };

  const handleApply = () => {
    console.log('User Details:');
    console.log(`Adhaar: ${userDetails.adhaar}`);
    console.log(`PAN: ${userDetails.pan}`);
    console.log(`Bank: ${userDetails.bank}`);
    console.log(`Personal Details: ${userDetails.personalDetails}`);
  };

  return (
    <Box>
      <Typography variant="h4">Service Title</Typography>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
        Sed cursus ante dapibus diam.
      </Typography>
      <Typography variant="h6" sx={{ marginTop: '20px' }}>Documents Needed</Typography>
      {documents.map((doc, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <Checkbox
            checked={doc.available}
            icon={<span style={{ color: 'red' }}>❌</span>}
            checkedIcon={<span style={{ color: 'green' }}>✔️</span>}
          />
          <Typography>{doc.name}</Typography>
        </Box>
      ))}
      <TextField label="Upload" type="file" fullWidth sx={{ marginTop: '20px' }} />
      <Button variant="contained" sx={{ marginTop: '20px' }} onClick={handleApply}>
        Apply
      </Button>
    </Box>
  );
};

export default ServiceDetails;
