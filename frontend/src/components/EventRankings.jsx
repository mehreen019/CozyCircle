import { getAllEventRankings } from '../helpers/ranking_api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { 
  Tabs, 
  Tab, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip
} from '@mui/material';
import { useState, useEffect } from 'react';

const EventRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);
      const data = await getAllEventRankings();
      const formattedData = data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      setRankings(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading rankings:', error);
      setError('Failed to load event rankings. Please try again later.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Sort functions for different tabs
  const getSortedEvents = () => {
    switch (tabValue) {
      case 0: // All rankings (no specific sort)
        return [...rankings];
      case 1: // Rating
        return [...rankings].sort((a, b) => a.ratingRank - b.ratingRank);
      case 2: // Attendees
        return [...rankings].sort((a, b) => a.attendeeRank - b.attendeeRank);
      case 3: // Capacity
        return [...rankings].sort((a, b) => a.capacityRank - b.capacityRank);
      case 4: // Available Capacity
        return [...rankings].sort((a, b) => a.availableCapacityRank - b.availableCapacityRank);
      default:
        return [...rankings];
    }
  };

  // Function to get rank badge color
  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#E0E0E0'; // Light gray for other ranks
  };

  if (loading) {
    return <div>Loading event rankings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sortedEvents = getSortedEvents();

  return (
    <div>
      <h1 style={{ color: 'black', marginBottom: '24px' }}>Event Rankings Analytics</h1>
      
      <Box sx={{ width: '100%', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="event ranking tabs"
        >
          <Tab label="Overview" />
          <Tab label="By Rating" />
          <Tab label="By Popularity" />
          <Tab label="By Capacity" />
          <Tab label="By Available Capacity" />
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              {tabValue === 0 && <TableCell>Rating Rank</TableCell>}
              {tabValue === 0 && <TableCell>Popularity Rank</TableCell>}
              {tabValue === 0 && <TableCell>Capacity Rank</TableCell>}
              {tabValue === 0 && <TableCell>Available Capacity Rank</TableCell>}
              {tabValue === 1 && <TableCell>Rating Rank</TableCell>}
              {tabValue === 1 && <TableCell>Average Rating</TableCell>}
              {tabValue === 2 && <TableCell>Popularity Rank</TableCell>}
              {tabValue === 2 && <TableCell>Attendee Count</TableCell>}
              {tabValue === 3 && <TableCell>Capacity Rank</TableCell>}
              {tabValue === 3 && <TableCell>Total Capacity</TableCell>}
              {tabValue === 4 && <TableCell>Available Capacity Rank</TableCell>}
              {tabValue === 4 && <TableCell>Remaining Seats</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{format(event.date, "MMMM do, yyyy")}</TableCell>
                <TableCell>{`${event.place}, ${event.city}, ${event.country}`}</TableCell>
                
                {/* Overview tab shows all rankings */}
                {tabValue === 0 && (
                  <>
                    <TableCell>
                      <Chip 
                        label={`#${event.ratingRank}`} 
                        style={{ backgroundColor: getRankColor(event.ratingRank), fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`#${event.attendeeRank}`} 
                        style={{ backgroundColor: getRankColor(event.attendeeRank), fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`#${event.capacityRank}`} 
                        style={{ backgroundColor: getRankColor(event.capacityRank), fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`#${event.availableCapacityRank}`} 
                        style={{ backgroundColor: getRankColor(event.availableCapacityRank), fontWeight: 'bold' }}
                      />
                    </TableCell>
                  </>
                )}
                
                {/* Rating tab */}
                {tabValue === 1 && (
                  <>
                    <TableCell>
                      <Chip 
                        label={`#${event.ratingRank}`} 
                        style={{ backgroundColor: getRankColor(event.ratingRank), fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{event.averageRating.toFixed(1)} ★</TableCell>
                  </>
                )}
                
                {/* Popularity tab */}
                {tabValue === 2 && (
                  <>
                    <TableCell>
                      <Chip 
                        label={`#${event.attendeeRank}`} 
                        style={{ backgroundColor: getRankColor(event.attendeeRank), fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{event.attendeeCount || 0} attendees</TableCell>
                  </>
                )}
                
                {/* Capacity tab */}
                {tabValue === 3 && (
                  <>
                    <TableCell>
                      <Chip 
                        label={`#${event.capacityRank}`} 
                        style={{ backgroundColor: getRankColor(event.capacityRank), fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{event.capacity} seats</TableCell>
                  </>
                )}
                
                {/* Available Capacity tab */}
                {tabValue === 4 && (
                  <>
                    <TableCell>
                      <Chip 
                        label={`#${event.availableCapacityRank}`} 
                        style={{ backgroundColor: getRankColor(event.availableCapacityRank), fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{event.availableCapacity || 0} seats left</TableCell>
                  </>
                )}
                
                <TableCell>
                  <Link
                    className="btn btn-secondary btn-sm mx-1"
                    to={{
                      pathname: "/viewCommonEvent",
                    }}
                    state={{ Event: event }}
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EventRankings; 