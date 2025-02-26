import React from 'react';
import { useLocation } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import { Box, Typography, Rating, Button } from '@mui/material';
import './Popup.css';
import NavigationLink from './shared/NavigationLink';
import { format } from "date-fns";
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { request, setAuthHeader } from '../helpers/axios_helper';

const CommonViewEvent = () => {
  const location = useLocation();
  const prevEvent = location?.state?.Event;
  const auth = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [rated, setRated] = useState(false);

  const canRate = auth.isLoggedIn && prevEvent.username !== auth.user.username;

  const handleRatingSubmit = async () => {
    try {
      console.log("Submitting rating for event ID: " + prevEvent.id + " with rating: " + userRating);

      const data = { 
        id: prevEvent.id, 
        userId: auth.user.id, 
        rating: userRating 
      };

      const res = await request("POST", "/events/rate", data);

      if (res.status === 200) {
        setRated(true);  // Update the UI after successful rating
        console.log("Rating submitted successfully!");
      } else {
        console.error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <Box
      display={"flex"}
      flex={{ xs: 1, md: 0.5 }}
      flexDirection="column"
      alignItems="center"
      padding={4}
      mt={4}
    >
      <Typography variant="h4" textAlign="center" fontWeight={600} color="black" mb={3}>
        Event Details
      </Typography>

      {/* Event Information */}
      <Box sx={{ width: "100%", maxWidth: 600 }}>
        <CustomizedInput type="name" name="name" label="Name" value={prevEvent.name} />
        <CustomizedInput type="description" name="description" label="Description" value={prevEvent.description} />
        <CustomizedInput type="place" name="place" label="Place" value={prevEvent.place} />
        <CustomizedInput type="city" name="city" label="City" value={prevEvent.city} />
        <CustomizedInput type="country" name="country" label="Country" value={prevEvent.country} />
        <CustomizedInput type="date" name="date" label="Date" value={format(prevEvent.date, "yyyy-MM-dd")} />
      </Box>

      <Box mt={4} />

      {/* Rating Display Section */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h6" mb={1}>Event Rating</Typography>
        <Rating value={prevEvent.rating || 0} precision={0.1} readOnly />
        <Typography variant="body2" mt={1}>Average Rating: {prevEvent.rating || 0} / 5</Typography>
      </Box>

      {/* Rating Input Section (If user is logged in and not event creator) */}
      {canRate && !rated && (
        <Box textAlign="center" mb={4}>
          <Typography variant="h6">Rate this Event</Typography>
          <Rating
            value={userRating}
            onChange={(event, newValue) => setUserRating(newValue)}
            precision={0.5}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleRatingSubmit}
          >
            Submit Rating
          </Button>
        </Box>
      )}

      {rated && <Typography color="green">Thank you for rating!</Typography>}

      <Box mt={4} />

      {/* Back Button */}
      <NavigationLink
        bg="#6D5147"
        to={auth.isLoggedIn ? "/ExploreEvent" : "/"}
        text={auth.isLoggedIn ? "Back" : "Back To Home"}
        textColor="black"
      />
    </Box>
  );
};

export default CommonViewEvent;
