import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';

interface CategoryCardProps {
  name: string;
  eventCount: number;
  icon?: LucideIcon;
  isLoading?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  name = 'Category', 
  eventCount = 0, 
  icon: Icon,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card sx={{ 
        borderRadius: 2,
        boxShadow: 1,
        border: '1px solid #e5e7eb',
        p: 3
      }}>
        <CardContent>
          <Box sx={{ animation: 'pulse 1.5s infinite' }}>
            <Box sx={{ height: 48, width: 48, bgcolor: 'grey.200', borderRadius: 1 }} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="75%" />
              <Skeleton variant="text" width="50%" />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      borderRadius: 2,
      boxShadow: 1,
      border: '1px solid #e5e7eb',
      p: 3,
      '&:hover': {
        boxShadow: 3,
        transition: 'all 0.3s ease'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {Icon && (
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 1,
                bgcolor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white'
                },
                transition: 'all 0.3s ease'
              }}>
                <Icon size={28} />
              </Box>
            )}
            
            <Box sx={{ 
              px: 1,
              py: 0.5,
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 'medium',
              bgcolor: eventCount > 0 ? 'success.light' : 'grey.100',
              color: eventCount > 0 ? 'success.dark' : 'grey.600'
            }}>
              {eventCount > 0 ? 'Active' : 'Empty'}
            </Box>
          </Box>
          
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary',
                '&:hover': {
                  color: 'primary.main'
                },
                transition: 'color 0.3s ease'
              }}
            >
              {name}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {eventCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                {eventCount === 1 ? 'event' : 'events'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;