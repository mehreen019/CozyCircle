import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllEventRankings } from '../helpers/ranking_api';
import NavigationLink from './shared/NavigationLink';
import { 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';

const EventAnalytics = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth?.user) {
      navigate("*");
      return;
    }
    loadRankings();
  }, [auth, navigate]);

  const loadRankings = async () => {
    try {
      setLoading(true);
      const data = await getAllEventRankings();
      setRankings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading rankings:', error);
      setError('Failed to load event analytics. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading event analytics...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Get top 5 events by different metrics
  const topRatedEvents = [...rankings].sort((a, b) => a.ratingRank - b.ratingRank).slice(0, 5);
  const mostPopularEvents = [...rankings].sort((a, b) => a.attendeeRank - b.attendeeRank).slice(0, 5);
  const largestEvents = [...rankings].sort((a, b) => a.capacityRank - b.capacityRank).slice(0, 5);
  const mostAvailableEvents = [...rankings].sort((a, b) => a.availableCapacityRank - b.availableCapacityRank).slice(0, 5);

  // Calculate some aggregate stats
  const totalEvents = rankings.length;
  const totalAttendees = rankings.reduce((sum, event) => sum + (event.attendeeCount || 0), 0);
  const totalCapacity = rankings.reduce((sum, event) => sum + event.capacity, 0);
  const averageRating = rankings.reduce((sum, event) => sum + event.averageRating, 0) / totalEvents || 0;
  const fillingRate = (totalAttendees / totalCapacity) * 100 || 0;

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Event Analytics Dashboard
          </Typography>
          <Box sx={{ mb: 4 }}>
            <NavigationLink
              bg="#AE9D99"
              to="/events/rankings"
              text="View Detailed Rankings"
              textColor="black"
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <NavigationLink
           bg="#C2B9B0"  // Slightly different shade for variety
          to="/events/category-counts"
           text="View Category Counts"
           textColor="black"
          />
</Box>
        </Grid>

        {/* Summary Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Events
              </Typography>
              <Typography variant="h3">{totalEvents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Attendees
              </Typography>
              <Typography variant="h3">{totalAttendees}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Rating
              </Typography>
              <Typography variant="h3">{averageRating.toFixed(1)} ★</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Capacity Filling Rate
              </Typography>
              <Typography variant="h3">{fillingRate.toFixed(1)}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Events Lists */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Rated Events
            </Typography>
            <List>
              {topRatedEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${index + 1}. ${event.name}`}
                      secondary={`Rating: ${event.averageRating.toFixed(1)} ★`}
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate("/viewCommonEvent", { state: { Event: event } })}
                    >
                      View
                    </Button>
                  </ListItem>
                  {index < topRatedEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Most Popular Events
            </Typography>
            <List>
              {mostPopularEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${index + 1}. ${event.name}`}
                      secondary={`Attendees: ${event.attendeeCount || 0}`}
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate("/viewCommonEvent", { state: { Event: event } })}
                    >
                      View
                    </Button>
                  </ListItem>
                  {index < mostPopularEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Largest Events (By Capacity)
            </Typography>
            <List>
              {largestEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${index + 1}. ${event.name}`}
                      secondary={`Capacity: ${event.capacity} seats`}
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate("/viewCommonEvent", { state: { Event: event } })}
                    >
                      View
                    </Button>
                  </ListItem>
                  {index < largestEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Events with Most Available Seats
            </Typography>
            <List>
              {mostAvailableEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${index + 1}. ${event.name}`}
                      secondary={`Available: ${event.availableCapacity || 0} seats`}
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate("/viewCommonEvent", { state: { Event: event } })}
                    >
                      View
                    </Button>
                  </ListItem>
                  {index < mostAvailableEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default EventAnalytics; 