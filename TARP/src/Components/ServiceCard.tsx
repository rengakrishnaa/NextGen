import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface ServiceCardProps {
  id: number;
  title: string;
  description: string;
  onApply: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({  title, description, onApply }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="textSecondary">{description}</Typography>
      <Button variant="contained" color="primary" onClick={onApply}>
        Apply
      </Button>
    </CardContent>
  </Card>
);

export default ServiceCard;


