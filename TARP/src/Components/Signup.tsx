import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper, Step, StepLabel, Button, Typography, TextField, Box, Container, Paper } from "@mui/material";
import axios from "axios";
import Web3 from 'web3';

const steps = [
  "Applicant Details",
  "Aadhaar Details",
  "PAN Details",
  "Bank Details",
];

declare global {
  interface Window {
    ethereum: any;  // Adding `ethereum` to the global window object
  }
}

const Signup = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>(""); 
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    qualification: "",
    father_name: "",
    mother_name: "",
    address_street: "",
    address_district: "",
    father_phone: "",
    mother_phone: "",
    adhaarName: "",
    adhaarPhone: "",
    adhaarAddress: "",
    adhaar_beneficiary: "",
    pan: "",
    bankName: "",
    bank_account: "",
    ifsc: "",
  });

  const loadWeb3 = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum); 
      setWeb3(web3Instance);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("User denied account access:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  

  useEffect(() => {
    loadWeb3();  
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  function getCookie(name: string) {
    let cookieValue = null;
    const allCookies = document.cookie; // Fetch all cookies
    console.log("All Cookies:", allCookies); // Debugging line

    if (allCookies && allCookies !== '') {
        const cookies = allCookies.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                console.log(`CSRF Token found: ${cookieValue}`); // Debugging line
                break;
            }
        }
    }
    return cookieValue;
}


useEffect(() => {
  axios.defaults.withCredentials = true;
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken; // Set CSRF token in the headers
  }
  
  console.log("Axios Defaults:", axios.defaults); // Debugging line
}, []);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {

      if (!web3 || !account) {
        console.error("Web3 or account not available. Please connect to MetaMask.");
        return;
      }
      const response = await axios.post("http://localhost:8000/api/applicant/", {
        ...formData,
        wallet: account // Add the wallet address to the form data
      });
      
      const token = response.data.token; // Assuming backend returns a token after registration
      localStorage.setItem("token", token); // Store token in localStorage
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set default header with token
      console.log("User registered successfully.");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="password"
            />
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="email"
            />
            <TextField
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="tel"
            />
            <TextField
              name="qualification"
              label="Qualification"
              value={formData.qualification}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="father_name"
              label="Father's Name"
              value={formData.father_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="mother_name"
              label="Mother's Name"
              value={formData.mother_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="address_street"
              label="Street Address"
              value={formData.address_street}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="address_district"
              label="District"
              value={formData.address_district}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="father_phone"
              label="Father's Phone"
              value={formData.father_phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="tel"
            />
            <TextField
              name="mother_phone"
              label="Mother's Phone"
              value={formData.mother_phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="tel"
            />
          </Box>
        );
      case 1:
        return (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              name="adhaarName"
              label="Aadhaar Name"
              value={formData.adhaarName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="adhaarPhone"
              label="Aadhaar Phone"
              value={formData.adhaarPhone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="tel"
            />
            <TextField
              name="adhaarAddress"
              label="Aadhaar Address"
              value={formData.adhaarAddress}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="adhaar_beneficiary"
              label="Aadhaar Beneficiary"
              value={formData.adhaar_beneficiary}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Box>
        );
      case 2:
        return (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              name="pan"
              label="PAN Number"
              value={formData.pan}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Box>
        );
      case 3:
        return (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              name="bankName"
              label="Bank Name"
              value={formData.bankName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="bank_account"
              label="Bank Account Number"
              value={formData.bank_account}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="ifsc"
              label="IFSC Code"
              value={formData.ifsc}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, mt: 5 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography variant="h6" gutterBottom>
                All steps completed - your form is submitted
              </Typography>
              <Button onClick={() => setActiveStep(0)}>Reset</Button>
            </div>
          ) : (
            <div>
              {renderStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </div>
          )}
        </div>
      </Paper>
    </Container>
  );
};


export default Signup