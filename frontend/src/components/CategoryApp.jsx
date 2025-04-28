import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CategorySection from './CategorySection';
import { Calendar, Users, Video, Network } from 'lucide-react';
import { Typography, Box } from '@mui/material';

const CategoryApp = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth?.user) {
      navigate("*");
      return;
    }
    loadCategories();
  }, [auth, navigate]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      // Simulated API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockCategories = [
        { id: 1, name: 'Conferences', eventCount: 8, icon: Calendar },
        { id: 2, name: 'Workshops', eventCount: 5, icon: Users },
        { id: 3, name: 'Networking', eventCount: 3, icon: Network },
        { id: 4, name: 'Webinars', eventCount: 12, icon: Video },
        { id: 5, name: 'Hackathons', eventCount: 4, icon: Calendar },
        { id: 6, name: 'Seminars', eventCount: 7, icon: Users },
        { id: 7, name: 'Meetups', eventCount: 6, icon: Network },
        { id: 8, name: 'Training', eventCount: 9, icon: Video },
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Event Categories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Browse through different types of events available
        </Typography>
      </Box>

      <CategorySection 
        categories={categories}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CategoryApp;
