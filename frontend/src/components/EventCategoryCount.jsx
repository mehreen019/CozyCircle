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
        console.log("API Response:", data);
        
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

  console.log("Rendering with:", { categoryData, isLoading, errorMessage });

  // Very basic styling with inline styles for maximum visibility
  const containerStyle = {
    padding: '15px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    margin: '10px',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100px',
    width: '300px'
  };

  const headingStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #ddd'
  };

  const categoryStyle = {
    fontWeight: 'normal'
  };

  const countStyle = {
    fontWeight: 'bold',
    color: '#0066cc'
  };

  if (isLoading) {
    return <div style={containerStyle}>Loading event categories...</div>;
  }

  if (errorMessage) {
    return <div style={containerStyle}>Error: {errorMessage}</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Event Categories</h2>
      {categoryData.length === 0 ? (
        <div>No category data available</div>
      ) : (
        categoryData.map((item, index) => (
          <div key={index} style={itemStyle}>
            <span style={categoryStyle}>{item.category}</span>
            <span style={countStyle}>{item.count}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default EventCategoryCount;