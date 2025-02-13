import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../helpers/api_communicator';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { TextField, MenuItem, Grid, Card, CardContent, Typography, Button, Select, FormControl, InputLabel } from '@mui/material';
import { useAuth} from '../context/AuthContext';
const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    console.log(auth.user);
    if (!auth?.user) {
      // User is not logged in, redirect to the login page or show an error
      navigate('/login');  // Redirect to the login page
    } else {
      loadEvents();
    }
  }, [auth, navigate]);
  const loadEvents = async () => {
    try {
      const response = await getAllEvents();
      const events = response.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px', fontSize: '2rem', fontWeight: 'bold' }}>Explore Events</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <TextField
          label="Search Events"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '350px', backgroundColor: 'white' }}
        />
        <FormControl variant="outlined" style={{ width: '300px', backgroundColor: 'white' }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            style={{ fontSize: '16px', padding: '12px' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Music">Music</MenuItem>
            <MenuItem value="Tech">Tech</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Grid container spacing={4} justifyContent="center">
        {events.map((event, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>{event.name}</Typography>
                <Typography variant="body1" style={{ color: '#555' }}>{event.city}, {event.country}</Typography>
                <Typography variant="body2" style={{ color: '#777' }}>{format(event.date, 'MMMM do, yyyy')}</Typography>
                <Typography variant="body2" style={{ color: '#f39c12', fontWeight: 'bold' }}>Rating: {event.rating}/5</Typography>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                  <Link className="btn mx-2 btn-secondary btn-outline-light" to={{ pathname: "/viewCommonEvent" }} state={{ Event: event }}>
                    View
                  </Link>
                  <Link className="btn btn-outline-primary mx-2 btn-outline-dark" to={{ pathname: "/registerAttendee" }} state={{ Event: event }}>
                    Register
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ExploreEvents;
