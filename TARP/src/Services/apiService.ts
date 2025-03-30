export const fetchServices = async (): Promise<any> => {
  const accessToken = localStorage.getItem('authToken'); // Retrieve token from local storage


  if (!accessToken) {
    throw new Error('No token found, please register again.');
  }

  const response = await fetch('http://localhost:8000/api/user/details/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,  // Attach token to the request
      'Content-Type': 'application/json'
    },
  });

  console.log('Response Status:', response.status); 

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch user details");
  }

  const userData = await response.json();
  console.log(userData);
  return userData;
};

