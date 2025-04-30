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
  Chip,
  Typography,
  CircularProgress,
  Fade,
  Button,
  Avatar,
  styled
} from '@mui/material';
import { useState, useEffect } from 'react';
import NavigationLink from './shared/NavigationLink';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Custom styled components
const StyledTableContainer = styled(TableContainer)({
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  overflow: 'hidden',
  marginTop: '20px',
  background: 'rgba(255, 255, 255, 0.9)'
});

const StyledTableHead = styled(TableHead)({
  background: 'linear-gradient(90deg, #6D5147 0%, #8D7B74 100%)',
});

const StyledTableHeadCell = styled(TableCell)({
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.05rem',
  padding: '16px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(174, 157, 153, 0.05)',
  },
  '&:hover': {
    backgroundColor: 'rgba(174, 157, 153, 0.15)',
    transition: 'background-color 0.2s ease',
  },
  transition: 'background-color 0.2s ease',
  '& .MuiTableCell-root': {
    fontSize: '1rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
});

const StyledTab = styled(Tab)({
  fontWeight: '600',
  fontSize: '1rem',
  padding: '12px 20px',
  textTransform: 'none',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  '&.Mui-selected': {
    color: '#6D5147',
    fontWeight: '700',
  },
  minWidth: '120px',
});

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#6D5147',
    height: '3px',
  },
});

const ViewButton = styled(Button)({
  backgroundColor: '#6D5147',
  color: 'white',
  padding: '8px 18px',
  fontSize: '0.95rem',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: '600',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: '#8D7B74',
  },
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '300px',
  flexDirection: 'column',
  gap: '20px'
});

const ErrorContainer = styled(Box)({
  padding: '20px',
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
  borderRadius: '8px',
  color: '#d32f2f',
  textAlign: 'center',
  margin: '40px auto',
  maxWidth: '400px'
});

const TabPanel = styled(Box)({
  padding: '20px 0',
});

const PageTitle = styled(Typography)({
  fontSize: '2.4rem',
  fontWeight: '700',
  margin: '24px 0',
  color: '#6D5147',
  textAlign: 'center',
  position: 'relative',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #6D5147 0%, #AE9D99 100%)',
    transform: 'translateX(-50%)',
    borderRadius: '2px'
  }
});

const EventRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

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
    setFadeIn(false);
    setTimeout(() => {
      setTabValue(newValue);
      setFadeIn(true);
    }, 300);
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
    if (rank === 1) return 'linear-gradient(135deg, #FFD700 30%, #FFC107 90%)'; // Gold
    if (rank === 2) return 'linear-gradient(135deg, #E0E0E0 30%, #C0C0C0 90%)'; // Silver
    if (rank === 3) return 'linear-gradient(135deg, #CD7F32 30%, #A0522D 90%)'; // Bronze
    return 'linear-gradient(135deg, #f5f5f5 30%, #e0e0e0 90%)'; // Light gray for other ranks
  };

  // Get tab icon based on tab index
  const getTabIcon = (index) => {
    switch (index) {
      case 1: return <StarIcon fontSize="small" />;
      case 2: return <PeopleIcon fontSize="small" />;
      case 3: return <EventSeatIcon fontSize="small" />;
      case 4: return <EventAvailableIcon fontSize="small" />;
      default: return null;
    }
  };

  // Get the top rank for display enhancement
  const getTopRankBadge = (rank) => {
    if (rank > 3) return null;
    
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    const labels = ['1st', '2nd', '3rd'];
    
    return (
      <Avatar 
        sx={{ 
          width: 24, 
          height: 24, 
          bgcolor: colors[rank-1],
          fontSize: '0.7rem',
          fontWeight: 'bold',
          marginRight: '8px'
        }}
      >
        {labels[rank-1]}
      </Avatar>
    );
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} thickness={4} sx={{ color: '#AE9D99' }} />
        <Typography variant="h6" color="#6D5147">Loading event rankings...</Typography>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Typography variant="h6" gutterBottom>Oops! Something went wrong</Typography>
        <Typography>{error}</Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2, color: '#6D5147', borderColor: '#6D5147' }}
          onClick={loadRankings}
        >
          Try Again
        </Button>
      </ErrorContainer>
    );
  }

  const sortedEvents = getSortedEvents();

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Link to="/events/analytics" style={{ textDecoration: 'none' }}>
          <Button startIcon={<ArrowBackIcon />} sx={{ color: '#6D5147' }}>
            Back to Analytics
          </Button>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <NavigationLink to="/events/category-counts" text="View Category Counts" bg="#AE9D99" textColor="black" />
          <NavigationLink to="/events/organizer-rankings" text="View Organizer Ranking" bg="#AE9D99" textColor="black" />
        </div>
      </Box>
      
      <PageTitle variant="h3">
        🏆 Event Rankings
      </PageTitle>
      
      <Box sx={{ width: '100%', mb: 4, mt: 6 }}>
        <StyledTabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="event ranking tabs"
          centered
        >
          <StyledTab label="Overview" />
          <StyledTab icon={getTabIcon(1)} label="By Rating" iconPosition="start" />
          <StyledTab icon={getTabIcon(2)} label="By Popularity" iconPosition="start" />
          <StyledTab icon={getTabIcon(3)} label="By Capacity" iconPosition="start" />
          <StyledTab icon={getTabIcon(4)} label="By Available Seats" iconPosition="start" />
        </StyledTabs>
      </Box>

      <Fade in={fadeIn} timeout={500}>
        <TabPanel>
          <StyledTableContainer component={Paper}>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <StyledTableHeadCell>Event</StyledTableHeadCell>
                  <StyledTableHeadCell>Date & Location</StyledTableHeadCell>
                  
                  {tabValue === 0 && <StyledTableHeadCell align="center">Rating</StyledTableHeadCell>}
                  {tabValue === 0 && <StyledTableHeadCell align="center">Popularity</StyledTableHeadCell>}
                  {tabValue === 0 && <StyledTableHeadCell align="center">Capacity</StyledTableHeadCell>}
                  {tabValue === 0 && <StyledTableHeadCell align="center">Available</StyledTableHeadCell>}
                  
                  {tabValue === 1 && <StyledTableHeadCell align="center">Rating Rank</StyledTableHeadCell>}
                  {tabValue === 1 && <StyledTableHeadCell align="center">Score</StyledTableHeadCell>}
                  
                  {tabValue === 2 && <StyledTableHeadCell align="center">Popularity Rank</StyledTableHeadCell>}
                  {tabValue === 2 && <StyledTableHeadCell align="center">Attendees</StyledTableHeadCell>}
                  
                  {tabValue === 3 && <StyledTableHeadCell align="center">Capacity Rank</StyledTableHeadCell>}
                  {tabValue === 3 && <StyledTableHeadCell align="center">Total Seats</StyledTableHeadCell>}
                  
                  {tabValue === 4 && <StyledTableHeadCell align="center">Availability Rank</StyledTableHeadCell>}
                  {tabValue === 4 && <StyledTableHeadCell align="center">Seats Left</StyledTableHeadCell>}
                  
                  <StyledTableHeadCell align="right">Details</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {sortedEvents.map((event) => (
                  <StyledTableRow key={event.id}>
                    <TableCell sx={{ fontWeight: '500' }}>{event.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '1rem' }}>
                        {format(event.date, "MMMM do, yyyy")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        {`${event.place}, ${event.city}, ${event.country}`}
                      </Typography>
                    </TableCell>
                    
                    {/* Overview tab shows all rankings */}
                    {tabValue === 0 && (
                      <>
                        <TableCell align="center">
                          <Chip 
                            avatar={getTopRankBadge(event.ratingRank)}
                            label={`#${event.ratingRank}`} 
                            sx={{ 
                              background: getRankColor(event.ratingRank),
                              fontWeight: 'bold',
                              color: event.ratingRank <= 3 ? 'black' : 'rgba(0,0,0,0.7)',
                              border: event.ratingRank <= 3 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            avatar={getTopRankBadge(event.attendeeRank)}
                            label={`#${event.attendeeRank}`} 
                            sx={{ 
                              background: getRankColor(event.attendeeRank),
                              fontWeight: 'bold',
                              color: event.attendeeRank <= 3 ? 'black' : 'rgba(0,0,0,0.7)',
                              border: event.attendeeRank <= 3 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            avatar={getTopRankBadge(event.capacityRank)}
                            label={`#${event.capacityRank}`} 
                            sx={{ 
                              background: getRankColor(event.capacityRank),
                              fontWeight: 'bold',
                              color: event.capacityRank <= 3 ? 'black' : 'rgba(0,0,0,0.7)',
                              border: event.capacityRank <= 3 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            avatar={getTopRankBadge(event.availableCapacityRank)}
                            label={`#${event.availableCapacityRank}`} 
                            sx={{ 
                              background: getRankColor(event.availableCapacityRank),
                              fontWeight: 'bold',
                              color: event.availableCapacityRank <= 3 ? 'black' : 'rgba(0,0,0,0.7)',
                              border: event.availableCapacityRank <= 3 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                            }}
                          />
                        </TableCell>
                      </>
                    )}
                    
                    {/* Rating tab */}
                    {tabValue === 1 && (
                      <>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getTopRankBadge(event.ratingRank)}
                            <Chip 
                              label={`#${event.ratingRank}`} 
                              sx={{ 
                                background: getRankColor(event.ratingRank),
                                fontWeight: 'bold',
                                color: event.ratingRank <= 3 ? 'black' : 'rgba(0,0,0,0.7)',
                                border: event.ratingRank <= 3 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <StarIcon sx={{ color: '#FFD700', mr: 0.5 }} />
                            <Typography variant="body1" fontWeight="bold" fontSize="1.05rem">{event.averageRating.toFixed(1)}</Typography>
                          </Box>
                        </TableCell>
                      </>
                    )}
                    
                    {/* Popularity tab */}
                    {tabValue === 2 && (
                      <>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getTopRankBadge(event.attendeeRank)}
                            <Chip 
                              label={`#${event.attendeeRank}`} 
                              sx={{ 
                                background: getRankColor(event.attendeeRank),
                                fontWeight: 'bold',
                                color: event.attendeeRank <= 3 ? 'black' : 'rgba(0,0,0,0.7)',
                                border: event.attendeeRank <= 3 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PeopleIcon sx={{ color: '#6D5147', mr: 0.5 }} />
                            <Typography variant="body1" fontWeight="bold" fontSize="1.05rem">{event.attendeeCount || 0}</Typography>
                          </Box>
                        </TableCell>
                      </>
                    )}
                    
                    {/* Capacity tab */}
                    {tabValue === 3 && (
                      <>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getTopRankBadge(event.capacityRank)}
                            <Chip 
                              label={`#${event.capacityRank}`} 
                              sx={{ 
                                background: getRankColor(event.capacityRank),
                                fontWeight: 'bold',
                                color: event.capacityRank <= 3 ? 'black' : 'rgba(0,0,0,0.7)',
                                border: event.capacityRank <= 3 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <EventSeatIcon sx={{ color: '#8D7B74', mr: 0.5 }} />
                            <Typography variant="body1" fontWeight="bold" fontSize="1.05rem">{event.capacity}</Typography>
                          </Box>
                        </TableCell>
                      </>
                    )}
                    
                    {/* Available Capacity tab */}
                    {tabValue === 4 && (
                      <>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getTopRankBadge(event.availableCapacityRank)}
                            <Chip 
                              label={`#${event.availableCapacityRank}`} 
                              sx={{ 
                                background: getRankColor(event.availableCapacityRank),
                                fontWeight: 'bold',
                                color: event.availableCapacityRank <= 3 ? 'black' : 'rgba(0,0,0,0.7)',
                                border: event.availableCapacityRank <= 3 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <EventAvailableIcon sx={{ color: '#AE9D99', mr: 0.5 }} />
                            <Typography variant="body1" fontWeight="bold" fontSize="1.05rem">{event.availableCapacity || 0}</Typography>
                          </Box>
                        </TableCell>
                      </>
                    )}
                    
                    <TableCell align="right">
                      <Link
                        to="/viewCommonEvent"
                        state={{ Event: event }}
                        style={{ textDecoration: 'none' }}
                      >
                        <ViewButton size="small">
                          View Details
                        </ViewButton>
                      </Link>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </TabPanel>
      </Fade>
    </Box>
  );
};

export default EventRankings; 