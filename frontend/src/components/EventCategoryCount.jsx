import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";

const EventCategoryCount = () => {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState([]);
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
        const response = await fetch(
          `http://localhost:8081/events/category/count?username=${user.username}`
        );
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process data to remove duplicates
        const processedData = [];
        const categories = new Set();
        
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (!categories.has(item.category)) {
              categories.add(item.category);
              processedData.push(item);
            }
          });
        }
        
        setCategoryData(processedData);
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.username]);

  // These are the critical CSS properties that prevent the white screen
  const criticalStyles = {
    position: 'relative',
    zIndex: 50,
    display: 'block',
    opacity: 1,
    overflow: 'visible'
  };

  // Professional-looking container styles
  const containerStyles = {
    ...criticalStyles,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    padding: '24px',
    margin: '16px 0',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#333333',
    maxWidth: '100%',
    width: '100%'
  };

  // Header styles
  const headerStyles = {
    color: '#2d3748',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    borderBottom: '1px solid #edf2f7',
    paddingBottom: '12px'
  };

  // Loading indicator styles
  const loadingStyles = {
    padding: '16px 0',
    color: '#718096',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center'
  };

  // Error message styles
  const errorStyles = {
    padding: '12px',
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '8px'
  };

  // Empty state styles
  const emptyStyles = {
    padding: '16px 0',
    color: '#718096',
    fontSize: '14px',
    fontStyle: 'italic'
  };

  // Item container styles
  const itemContainerStyles = {
    marginTop: '8px'
  };

  // Individual item styles
  const itemStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #edf2f7',
    transition: 'background-color 0.2s',
    borderRadius: '4px'
  };

  // Item hover effect - note: this won't work with inline styles but keeping for reference
  const itemHoverStyles = {
    backgroundColor: '#f7fafc'
  };

  // Category name styles
  const categoryStyles = {
    color: '#4a5568',
    fontSize: '15px'
  };

  // Count styles
  const countStyles = {
    fontWeight: '600',
    color: '#3182ce',
    backgroundColor: '#ebf8ff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '14px'
  };

  // Total count specific styles - for highlighting the total
  const totalCountStyles = {
    ...countStyles,
    backgroundColor: '#c6f6d5',
    color: '#38a169'
  };

  return (
    <div style={containerStyles}>
      <h2 style={headerStyles}>Event Category Counts</h2>
      
      {isLoading && (
        <div style={loadingStyles}>
          <div style={{marginRight: '8px'}}>Loading categories</div>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #cbd5e0',
            borderTopColor: '#3182ce',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}
      
      {!isLoading && errorMessage && (
        <div style={errorStyles}>
          <span style={{fontWeight: '500'}}>Error:</span> {errorMessage}
        </div>
      )}
      
      {!isLoading && !errorMessage && categoryData.length === 0 && (
        <div style={emptyStyles}>No category data available</div>
      )}
      
      {!isLoading && !errorMessage && categoryData.length > 0 && (
        <div style={itemContainerStyles}>
          {categoryData.map((item, index) => (
            <div key={index} style={itemStyles}>
              <span style={categoryStyles}>
                {item.category}
              </span>
              <span style={item.category === 'Total' ? totalCountStyles : countStyles}>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EventCategoryCount;