import { useEffect, useState } from 'react';
import axios from 'axios';

// Define interface for user details
interface UserDetails {
  wallet: string;
  name: string;
  email: string;
  adhaar: string;
  pan: string;
  bank_details: string;
}

const ServicePage = () => {
  const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Function to get CSRF token from cookies
  const getCsrfToken = () => {
    return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))?.split('=')[1];
  };

  // Fetch user details from the backend
  const fetchUserDetails = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No token found!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/api/users/', {
        //headers: {
        //  'Authorization': `Bearer ${token}`,
        //  'X-CSRFToken': getCsrfToken(),
        //},
        withCredentials: true,  // To send cookies (if CSRF cookie is set)
      });

      console.log("User details fetched:", response.data);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details', error);
      setError('Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Render user details
  return (
    <div>
      <h1>Service Page</h1>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>User Details</h2>
          <ul>
            {userDetails.map((user, index) => (
              <li key={index}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Wallet:</strong> {user.wallet}</p>
                <p><strong>Aadhaar:</strong> {user.adhaar}</p>
                <p><strong>PAN:</strong> {user.pan}</p>
                <p><strong>Bank Details:</strong> {user.bank_details}</p>
                <button onClick={() => console.log(user)}>Log User Details</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
