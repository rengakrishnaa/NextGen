import React, { useEffect, useState } from "react";
import { fetchServices } from "./apiService";

// Define a type or interface for the service object
interface Service {
  id: string; // Assuming id is a string, change it to number if needed
  name: string;
}

const ServicesComponent: React.FC = () => {
  // Define the type for the state using the Service interface
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const getServices = async () => {
      try {
        const servicesData: Service[] = await fetchServices(); // Specify the return type here
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    getServices();
  }, []);

  return (
    <div>
      {services.length > 0 ? (
        services.map((service: Service) => <div key={service.id}>{service.name}</div>)
      ) : (
        <p>No services available</p>
      )}
    </div>
  );
};

export default ServicesComponent;
