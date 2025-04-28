import React from 'react';
import CategoryCard from './CategoryCard';
import type { LucideIcon } from 'lucide-react';
import { Grid, Typography, Box } from '@mui/material';

interface Category {
  id: string | number;
  name: string;
  eventCount: number;
  icon?: LucideIcon;
}

interface CategorySectionProps {
  categories: Category[];
  isLoading: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  categories = [], 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <CategoryCard 
              name="" 
              eventCount={0} 
              isLoading={true} 
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (categories.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6, 
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        border: '1px solid #e5e7eb'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 400, mx: 'auto' }}>
          <Typography variant="h6" color="text.primary">
            No Categories Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no event categories available at the moment. Check back later or contact support.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={3} key={category.id}>
          <CategoryCard 
            name={category.name}
            eventCount={category.eventCount}
            icon={category.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CategorySection;