import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationLink from './shared/NavigationLink';
import { getWaitlist, getEvent, getAttendees } from '../helpers/api_communicator';
import './Popup.css';

const WaitlistView = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevEvent, setPrevEvent] = useState({});
  const [showWaitlist, setShowWaitlist] = useState(false); // toggle state

  const auth = useAuth();
  const navigate = useNavigate();
  const { eventId } = useParams();

  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    } else {
      loadEventData();
    }
  }, [auth, navigate]);

  const loadEventData = async () => {
    try {
      setLoading(true);

      const eventRes = await getEvent(eventId);
      setPrevEvent(eventRes);

      if (eventRes.username !== auth.user.username) {
        console.error("Unauthorized access: Not event creator.");
        return;
      }

      const waitlistRes = await getWaitlist(eventRes.id);
      const attendeesRes = await getAttendees(`/attendees/${eventRes.id}`);

      setWaitlist(waitlistRes);
      setAttendees(attendeesRes);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const displayedList = showWaitlist ? waitlist : attendees;

  return (
    <Box
      display={"flex"}
      flex={{ xs: 1, md: 0.5 }}
      justifyContent={"center"}
      alignItems={"center"}
      padding={2}
      ml={"auto"}
      mt={4}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          padding={2}
          fontWeight={600}
          color={'black'}
        >
          {showWaitlist ? `Waitlist for ${prevEvent.name}` : `Attendees of ${prevEvent.name}`}
        </Typography>

        <Button
          onClick={() => setShowWaitlist(!showWaitlist)}
          sx={{ margin: "0 auto 20px", width: "fit-content", bgcolor: '#D3C0B0', color: 'black' }}
        >
          {showWaitlist ? "Show Attendees" : "Show Waitlist"}
        </Button>

        {loading ? (
          <Box display="flex" justifyContent="center" padding={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {displayedList.length === 0 ? (
              <Typography textAlign="center" padding={4}>
                {showWaitlist ? "No users in the waitlist." : "No attendees have joined."}
              </Typography>
            ) : (
              <Box sx={{
                height: '400px',
                overflowY: 'scroll',
                justifyContent: "center",
                marginBottom: '24px'
              }}>
                <div className='container'>
                  {displayedList.map((user, index) => (
                    <div key={index} className='listel' style={{ marginTop: '24px' }}>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                      {showWaitlist && (
                        <>
                          <p>Position: {user.position}</p>
                          <p>Registered: {formatDate(user.registrationTime)}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Box>
            )}
          </>
        )}

        <Box display="flex" justifyContent="center" mt={2}>
          <NavigationLink
            bg="#6D5147"
            to="/dashboard"
            text="Back to Dashboard"
            textColor="black"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WaitlistView;
