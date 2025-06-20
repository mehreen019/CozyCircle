import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import { Box, Typography, Rating, Button } from '@mui/material';
import './Popup.css';
import NavigationLink from './shared/NavigationLink';
import { format } from "date-fns";
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { request } from '../helpers/axios_helper';
import { getUserRatingForEvent, checkRegistrationStatus } from '../helpers/api_communicator';

const CommonViewEvent = () => {
  const location = useLocation();
  const prevEvent = location?.state?.Event;
  const auth = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  // Check if user can rate (logged in and not event creator)
  const userCanPotentiallyRate = auth.isLoggedIn && prevEvent.username !== auth.user.username;

  // Check registration status and user rating when component mounts
  useEffect(() => {
    const checkUserStatus = async () => {
      if (userCanPotentiallyRate && auth.user?.email) {
        try {
          setLoading(true);

          // Check if user is registered for the event
          const registrationStatus = await checkRegistrationStatus(prevEvent.id, auth.user.email);
          setIsRegistered(registrationStatus.status === "registered");

          // If user is registered, check their previous rating
          if (registrationStatus.status === "registered" && auth.user?.id) {
            const rating = await getUserRatingForEvent(prevEvent.id, auth.user.id);
            if (rating > 0) {
              setUserRating(rating);
              setRated(true);
            }
          }
        } catch (error) {
          console.error("Error checking user status:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [userCanPotentiallyRate, prevEvent.id, auth.user?.id, auth.user?.email]);

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

  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
    setRated(false); // Allow resubmitting if rating changes
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
        <CustomizedInput type="category" name="category" label="Category" value={prevEvent.category} />
        <CustomizedInput type="date" name="date" label="Date" value={format(prevEvent.date, "yyyy-MM-dd")} />
      </Box>

      <Box mt={4} />

      {/* Rating Display Section */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h6" mb={1}>Event Rating</Typography>
        <Rating 
          value={prevEvent.averageRating || prevEvent.rating || 0} 
          precision={0.1} 
          readOnly 
        />
        <Typography variant="body2" mt={1}>
          Average Rating: {(prevEvent.averageRating || prevEvent.rating || 0).toFixed(1)} / 5
          {prevEvent.totalRatings > 0 && ` (${prevEvent.totalRatings} ratings)`}
        </Typography>
      </Box>

      {/* Rating Input Section (If user is logged in, not event creator, and registered for the event) */}
      {userCanPotentiallyRate && isRegistered && !prevEvent.archived && !loading && (
        <Box textAlign="center" mb={4}>
          <Typography variant="h6">
            {rated ? "Your Rating" : "Rate this Event"}
          </Typography>
          <Rating
            value={userRating}
            onChange={handleRatingChange}
            precision={0.5}
          />
          {!rated && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleRatingSubmit}
            >
              Submit Rating
            </Button>
          )}
          {rated && (
            <Typography color="green" mt={1}>
              {userRating > 0 ? "You've rated this event!" : ""}
            </Typography>
          )}
        </Box>
      )}

      {/* Show message if user is not registered but could potentially rate */}
      {userCanPotentiallyRate && !isRegistered && !loading && (
        <Box textAlign="center" mb={4}>
          <Typography color="error">
            You must be registered for this event to rate it.
          </Typography>
        </Box>
      )}

      {/* Loading indicator */}
      {loading && <Typography>Loading your rating...</Typography>}

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
