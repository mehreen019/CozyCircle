import React from 'react';
import { useLocation } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import { Box, Typography, Rating } from '@mui/material';
import './Popup.css';
import NavigationLink from './shared/NavigationLink';
import { format } from "date-fns";

const CommonViewEvent = () => {
  const location = useLocation();
  const prevEvent = location?.state?.Event;

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

      <Box mt={4} />

      {/* Back Button */}
      <NavigationLink bg="#6D5147" to="/allEvents" text="Back" textColor="black" />
    </Box>
  );
};

export default CommonViewEvent;
