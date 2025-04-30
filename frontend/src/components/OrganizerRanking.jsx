import { useState, useEffect } from 'react';
import { getOrganizerRankings } from '../helpers/api_communicator';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  CircularProgress,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigationLink from './shared/NavigationLink';

const OrganizerRankings = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrganizerRankings();
  }, []);

  const loadOrganizerRankings = async () => {
    try {
      setLoading(true);
      const data = await getOrganizerRankings();
      setOrganizers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading organizer rankings:', error);
      setError('Failed to load organizer rankings. Please try again later.');
      setLoading(false);
    }
  };

  // Function to determine medal color based on ranking
  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return null;
    }
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress sx={{ color: '#AE9D99' }} /></Box>;
  }

  if (error) {
    return <Box textAlign="center" mt={5}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Link to="/events/analytics" style={{ textDecoration: 'none' }}>
            <Button startIcon={<ArrowBackIcon />} sx={{ color: '#6D5147' }}>
              Back to Analytics
            </Button>
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <NavigationLink to="/events/rankings" text="View Detailed Rankings" bg="#AE9D99" textColor="black" />
            <NavigationLink to="/events/category-counts" text="View Category Counts" bg="#AE9D99" textColor="black" />
          </div>
        </Box>


      <Typography variant="h4" gutterBottom color="black" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmojiEventsIcon sx={{ color: '#6D5147' }} />
        Top Event Organizers
      </Typography>
      
      <Paper elevation={3} sx={{ overflow: 'hidden', bgcolor: 'rgba(174, 157, 153, 0.1)', borderRadius: '8px' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#6D5147', color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ bgcolor: '#6D5147', color: 'white', fontWeight: 'bold' }}>Organizer</TableCell>
                <TableCell sx={{ bgcolor: '#6D5147', color: 'white', fontWeight: 'bold' }}>Events Created</TableCell>
                <TableCell sx={{ bgcolor: '#6D5147', color: 'white', fontWeight: 'bold' }}>Average Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organizers.map((organizer) => (
                <TableRow 
                  key={organizer.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { bgcolor: 'rgba(174, 157, 153, 0.05)' },
                    '&:hover': { bgcolor: 'rgba(174, 157, 153, 0.15)' },
                    borderLeft: getMedalColor(organizer.rank) ? `6px solid ${getMedalColor(organizer.rank)}` : 'none'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {organizer.rank <= 3 ? (
                        <Chip 
                          label={`#${organizer.rank}`}
                          sx={{ 
                            bgcolor: getMedalColor(organizer.rank),
                            color: organizer.rank === 1 ? 'black' : 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      ) : (
                        `#${organizer.rank}`
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: '#8D7B74', width: 36, height: 36 }}>
                        {getInitials(organizer.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{organizer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">@{organizer.username}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={organizer.eventCount}
                      size="small"
                      sx={{ bgcolor: '#AE9D99', color: 'black' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating 
                        value={organizer.averageRating} 
                        precision={0.1} 
                        readOnly 
                        size="small"
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {organizer.averageRating.toFixed(1)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OrganizerRankings;