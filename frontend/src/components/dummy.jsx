import React, { useEffect, useState } from 'react';
import { getTotalRatings } from '../helpers/api_communicator';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const TotalRatingsPage = () => {
  const { eventId } = useParams();
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalRatings = async () => {
      try {
        const ratings = await getTotalRatings(eventId);
        setTotalRatings(ratings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalRatings();
  }, [eventId]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">Error: {error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4">Total Ratings for Event ID: {eventId}</Typography>
      <Typography variant="h5">Total Ratings: {totalRatings}</Typography>
    </Box>
  );
};

export default TotalRatingsPage;
