import { useState, useEffect }  from 'react'
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import { Box, Typography } from '@mui/material'
import './Popup.css'
import { getAttendees } from '../helpers/api_communicator';
import NavigationLink from './shared/NavigationLink';
import { format } from "date-fns";
import { unregisterUser } from '../helpers/api_communicator';
import { toast } from 'react-hot-toast';

const ViewEvent = () => {

  const [attendees, setAttendees] = useState([]);

  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location)

  const prevEvent = location?.state.Event;


  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    }
    else{
        loadAttendees();
    }
  }, [auth, navigate]);

  const loadAttendees = async () => {
    if (prevEvent.username !== auth.user.username) {
      
      console.error("Unauthorized access: You are not the event creator.");
      return;
    }
  
    try {
      const response = await getAttendees(`/attendees/${prevEvent.id}`);
      console.log(response);
      setAttendees(response);
    } catch (error) {
      console.error("Error loading attendees:", error);
    }
  };

  const handleUnregisterClick = async (event) => {
      if (!auth?.user) {
        toast.error("You must be logged in to unregister.");
        return;
      }
    
      try {
        toast.info("Unregistering...", { autoClose: 2000 });
    
        const response = await unregisterUser(event.id, auth.user.email);
  
        console.log(response);
    
        if (response.status === 200) {
          toast.success("Unregistered Successfully!", { autoClose: 3000 });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to unregister. Try again.");
      }
      finally{
         navigate("/dashboard");
      }

     
  };
  


  return (
    (
      <Box
        display={"flex"}
        flex={{ xs: 1, md: 0.5 }}
        justifyContent={"center"}
        alignItems={"center"}
        padding={2}
        ml={"auto"}
        mt={4}
      >
        <form >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              padding={2}
              fontWeight={600}
              color={'black'}
            >
            Event Details
            </Typography>
            <CustomizedInput type="name" name="name" label="Name" value={prevEvent.name}/>
            <CustomizedInput type="description" name="description" label="Description" value={prevEvent.description}/>
            <CustomizedInput type="place" name="place" label="Place" value={prevEvent.place}/>
            <CustomizedInput type="city" name="city" label="City" value={prevEvent.city}/>
            <CustomizedInput type="country" name="country" label="Country" value={prevEvent.country}/>
            <CustomizedInput type="date" name="date" label="Date" value={format(prevEvent.date, "yyyy-MM-dd")}/>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              
              { prevEvent.username === auth.user.username ? (
                <NavigationLink
                  bg="#AE9D99"
                  to={`/${prevEvent.id}/waitlist-view`}
                  state={{ Event: prevEvent }}
                  text="View Attendee and Waitlist"
                  textColor="black"
                />
              )
            : (
              <button
                  style={{ backgroundColor: "#AE9D99", color: "black", border: "none", borderRadius: "4px", cursor: "pointer", padding: "8px 16px", textAlign: "center", fontWeight: "600", fontSize: "18px" }}
                  onClick={handleUnregisterClick}
                >
                  Unregister
              </button>
              )}

              <NavigationLink
                bg="#6D5147"
                to="/dashboard"
                text="Back"
                textColor="black"
              />
            </Box>

          </Box>
        </form>
      </Box>
    )
  )
}

export default ViewEvent