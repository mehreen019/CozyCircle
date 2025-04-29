import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { FaExclamationCircle, FaSpinner } from 'react-icons/fa'; // Importing icons

const EventCategoryCount = () => {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
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

  const containerStyles = {
    background: '#f0f4f8',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    padding: '32px',
    margin: '20px 0',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#333',
    maxWidth: '100%',
    width: '100%',
    transition: 'transform 0.3s',
  };

  const headerStyles = {
    color: '#2d3748',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '20px',
    textAlign: 'center',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  };

  const loadingStyles = {
    padding: '16px 0',
    color: '#718096',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const errorStyles = {
    padding: '12px',
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    borderRadius: '4px',
    fontSize: '16px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const emptyStyles = {
    padding: '16px 0',
    color: '#718096',
    fontSize: '16px',
    fontStyle: 'italic',
    textAlign: 'center',
  };

  const itemContainerStyles = {
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  };

  const itemStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  };

  const itemHoverStyles = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0  2)',
  };

  const categoryStyles = {
    color: '#4a5568',
    fontSize: '18px',
    fontWeight: '600',
  };

  const countStyles = {
    fontWeight: '600',
    color: '#3182ce',
    backgroundColor: '#ebf8ff',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '16px',
  };

  const totalCountStyles = {
    ...countStyles,
    backgroundColor: '#c6f6d5',
    color: '#38a169',
  };

  return (
    <div style={containerStyles}>
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
        <div style={itemContainerStyles}>
          {categoryData.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                ...itemStyles, 
                ...(item.category === 'Total' ? totalCountStyles : {}), 
                ':hover': itemHoverStyles 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = itemHoverStyles.transform;
                e.currentTarget.style.boxShadow = itemHoverStyles.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
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
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default EventCategoryCount;