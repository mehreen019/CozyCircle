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
  Button,
  CircularProgress,
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

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
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box textAlign="center" mt={5}><Typography color="error">{error}</Typography></Box>;
  }

  // Sort and select top 5 events
  const topRatedEvents = [...rankings].sort((a, b) => a.ratingRank - b.ratingRank).slice(0, 5);
  const mostPopularEvents = [...rankings].sort((a, b) => a.attendeeRank - b.attendeeRank).slice(0, 5);
  const largestEvents = [...rankings].sort((a, b) => a.capacityRank - b.capacityRank).slice(0, 5);
  const mostAvailableEvents = [...rankings].sort((a, b) => a.availableCapacityRank - b.availableCapacityRank).slice(0, 5);

  const totalEvents = rankings.length;
  const totalAttendees = rankings.reduce((sum, e) => sum + (e.attendeeCount || 0), 0);
  const totalCapacity = rankings.reduce((sum, e) => sum + e.capacity, 0);
  const averageRating = rankings.reduce((sum, e) => sum + e.averageRating, 0) / totalEvents || 0;
  const fillingRate = (totalAttendees / totalCapacity) * 100 || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Event Analytics Dashboard
      </Typography>

      <Grid container spacing={2}>
        {/* Navigation */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <NavigationLink to="/events/rankings" text="View Detailed Rankings" bg="#AE9D99" textColor="black" />
            <NavigationLink to="/events/category-counts" text="View Category Counts" bg="#C2B9B0" textColor="black" />
          </Box>
        </Grid>

        {/* Summary KPIs */}
        {[{
          title: "Total Events",
          value: totalEvents
        }, {
          title: "Total Attendees",
          value: totalAttendees
        }, {
          title: "Average Rating",
          value: `${averageRating.toFixed(1)} ★`
        }, {
          title: "Filling Rate",
          value: `${fillingRate.toFixed(1)}%`
        }].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={4}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>{stat.title}</Typography>
                <Typography variant="h4">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Charts Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Top Rated Events</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={topRatedEvents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="averageRating" stroke="#8884d8" strokeWidth={2} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Most Popular Events (Attendees)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mostPopularEvents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendeeCount" stroke="#82ca9d" strokeWidth={2} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Largest Events (Capacity)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={largestEvents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="capacity" stroke="#ffa726" strokeWidth={2} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Most Available Seats</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mostAvailableEvents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="availableCapacity" stroke="#ef5350" strokeWidth={2} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventAnalytics;
