import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigationLink from './shared/NavigationLink';
import {
  Box,
  Button
} from '@mui/material';

const EventCategoryCount = () => {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user?.username) {
      setIsLoading(false);
      setErrorMessage('No username available');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch category count data
        const categoryResponse = await fetch(
          `http://localhost:8081/events/category/count?username=${user.username}`
        );
        
        if (!categoryResponse.ok) {
          throw new Error(`Error: ${categoryResponse.status}`);
        }
        
        const categoryData = await categoryResponse.json();
        
        // Process category data to remove duplicates
        const processedCategoryData = [];
        const categories = new Set();
        
        if (Array.isArray(categoryData)) {
          categoryData.forEach(item => {
            if (!categories.has(item.category)) {
              categories.add(item.category);
              processedCategoryData.push(item);
            }
          });
        }
        
        setCategoryData(processedCategoryData);

        // Fetch location data
        const locationResponse = await fetch(
          `http://localhost:8081/events/place?username=${user.username}`
        );

        if (!locationResponse.ok) {
          throw new Error(`Error: ${locationResponse.status}`);
        }

        const locationData = await locationResponse.json();
        console.log("Location Data:", JSON.stringify(locationData, null, 2));
        
        // Process location data
        if (Array.isArray(locationData)) {
          // Convert to array format with proper null/empty string handling
          const processedData = locationData.map(item => ({
            category: item?.category ?? 'null',
            location: item?.place === '' ? 'null' : (item?.place ?? 'null'),
            count: item?.eventCount ?? 0
          }));

          // Sort by count (ascending), then category, then location
          processedData.sort((a, b) => {
            if (a.count !== b.count) {
              return a.count - b.count; // Sort by count in ascending order
            }
            if (a.category === b.category) {
              return a.location.localeCompare(b.location);
            }
            return a.category.localeCompare(b.location);
          });
          
          setLocationData(processedData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.username]);

  // Styles
  const containerStyles = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    margin: '16px 0',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#333333',
    maxWidth: '100%',
    width: '100%'
  };

  const headerStyles = {
    color: '#2d3748',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
    borderBottom: '2px solid #edf2f7',
    paddingBottom: '12px'
  };

  const loadingStyles = {
    padding: '16px 0',
    color: '#718096',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center'
  };

  const errorStyles = {
    padding: '12px',
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    borderRadius: '4px',
    fontSize: '16px',
    marginBottom: '8px'
  };

  const emptyStyles = {
    padding: '16px 0',
    color: '#718096',
    fontSize: '16px',
    fontStyle: 'italic'
  };

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px'
  };

  const headerCellStyles = {
    backgroundColor: '#f4f4f4',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #edf2f7',
    fontWeight: '600'
  };

  const rowStyles = {
    padding: '12px',
    borderBottom: '1px solid #edf2f7',
    transition: 'background-color 0.2s',
  };

  const categoryCellStyles = {
    padding: '12px',
    color: '#4a5568',
    fontSize: '16px'
  };

  const countStyles = {
    fontWeight: '600',
    color: '#3182ce',
    backgroundbackgroundColor: '#e2f0fa',
    borderRadius: '4px',
    padding: '4px 8px',
    textAlign: 'center'
  };

  const totalCountStyles = {
    fontWeight: '700',
    color: '#2c5282',
    backgroundColor: '#cbd5e0',
    borderRadius: '4px',
    padding: '4px 8px',
    textAlign: 'center'
  };

  const itemHoverStyles = {
    backgroundColor: '#f1f1f1',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyles}>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Link to="/events/analytics" style={{ textDecoration: 'none' }}>
                  <Button startIcon={<ArrowBackIcon />} sx={{ color: '#6D5147' }}>
                    Back to Analytics
                  </Button>
                </Link>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <NavigationLink to="/events/rankings" text="View Detailed Rankings" bg="#AE9D99" textColor="black" />
                  <NavigationLink to="/events/organizer-rankings" text="View Organizer Ranking" bg="#AE9D99" textColor="black" />
                </div>
              </Box>

      <h2 style={headerStyles}>Event Category Counts</h2>
      
      {isLoading && (
        <div style={loadingStyles}>
          <FaSpinner className="spin" style={{ marginRight: '8px', fontSize: '20px' }} />
          <div>Loading categories...</div>
        </div>
      )}
      
      {!isLoading && errorMessage && (
        <div style={errorStyles}>
          <FaExclamationCircle style={{ marginRight: '8px' }} />
          <span>Error: {errorMessage}</span>
        </div>
      )}
      
      {!isLoading && !errorMessage && categoryData.length === 0 && (
        <div style={emptyStyles}>No category data available</div>
      )}
      
      {!isLoading && !errorMessage && categoryData.length > 0 && (
        <>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={headerCellStyles}>Category</th>
                <th style={headerCellStyles}>Count</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    ...rowStyles, 
                    ...(item.category === 'Total' ? totalCountStyles : {}), 
                    ':hover': itemHoverStyles 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = itemHoverStyles.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={categoryCellStyles}>
                    {item.category}
                  </td>
                  <td style={item.category === 'Total' ? totalCountStyles : countStyles}>
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            height: '1px',
            backgroundColor: '#e2e8f0',
            margin: '32px 0',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }} />

          <h2 style={{...headerStyles, marginTop: '16px'}}>Event Category by Location</h2>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={headerCellStyles}>Category</th>
                <th style={headerCellStyles}>Location</th>
                <th style={headerCellStyles}>Count</th>
              </tr>
            </thead>
            <tbody>
              {locationData.map((item, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    ...rowStyles,
                    ...(item.category === 'Total' ? totalCountStyles : {}),
                    ':hover': itemHoverStyles 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = itemHoverStyles.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={categoryCellStyles}>{item.category}</td>
                  <td style={categoryCellStyles}>{item.location}</td>
                  <td style={item.category === 'Total' ? totalCountStyles : countStyles}>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default EventCategoryCount;