import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const Menu = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: '10px', bgcolor: 'transparent', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" sx={{ bgcolor: '#6D5147', '&:hover': { bgcolor: '#AE9D99' } }}>Home</Button>
            </Link>
            <div style={{ margin: '0 10px' }}></div>
            <Link to="/allEvents" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" sx={{ bgcolor: '#6D5147', '&:hover': { bgcolor: '#AE9D99' } }}>All Events</Button>
            </Link>
            <div style={{ margin: '0 10px' }}></div>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" sx={{ bgcolor: '#6D5147', '&:hover': { bgcolor: '#AE9D99' } }}>Dashboard</Button>
            </Link>
            <div style={{ margin: '0 10px' }}></div>
            <Link to="/addEvent" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" sx={{ bgcolor: '#6D5147', '&:hover': { bgcolor: '#AE9D99' } }}>Add Event</Button>
            </Link>
            <div style={{ margin: '0 10px' }}></div>
            <Link to="/ExploreEvent" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" sx={{ bgcolor: '#6D5147', '&:hover': { bgcolor: '#AE9D99' } }}>Explore Events</Button>
            </Link>
        </Box>
    );
};

export default Menu; 