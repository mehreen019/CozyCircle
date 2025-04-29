import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'; // Fix typo here (sick → slick)
import { getAllEvents, addAttendee, filterEvents, getRegisteredEvents, unregisterUser } from '../helpers/api_communicator';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterPanel from './FilterPanel';
import '../styles/ExploreEvents.css';



const carouselSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};
const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reset, setReset] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
const [recommendedEvents, setRecommendedEvents] = useState([]);
const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    city: '',
    country: '',
    minRating: 0,
    maxRating: 5,
    startDate: null,
    endDate: null,
    minCapacity: null, 
    maxCapacity: null,
    sortBy: 'rating',
    category: 'All'
  });
  const navigate = useNavigate();
  const auth = useAuth();

  // First useEffect to handle navigation and initial event fetch
  useEffect(() => {
    if (!auth?.user) {
      navigate('/login');
    } else {
      // Initial load
      fetchEvents();
      setReset(false); // Reset the reset state after fetching events
    }
  }, [auth, navigate, reset]); // Removed registeredEventIds from dependencies

  // Second useEffect to handle registered events fetch
  useEffect(() => {
    if (auth?.user) {
      fetchRegisteredEvents();
    }
  }, [auth?.user?.email]); // Only depend on the user's email
   // Fetch recommended events
   useEffect(() => {
    const fetchRecommendedEvents = async () => {
      if (!auth?.user?.username) return;
      
      try {
        console.log(auth.user.username);
        const response = await fetch(
          `http://localhost:8081/events/recommended?username=${auth.user.username}`
        );
        
        // First check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON data from the response
        const data = await response.json();
        console.log("Parsed data:", data);
        
        // Now format the events
        setRecommendedEvents(formatEvents(data));
        
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast.error('Failed to load recommendations');
      } finally {
        setRecommendedLoading(false);
      }
    };
  
    fetchRecommendedEvents();
  }, [auth?.user?.username]);
  // Function to fetch events based on the applied filters
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Otherwise use the filter endpoint with the current filter state 
      const filterParams = prepareFilterParams();

      console.log("Filtered parameters:", filterParams);
      const response = await filterEvents(filterParams);
      console.log("Filtered events:", response);
      setEvents(formatEvents(response));
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to getAllEvents if the filter/search API fails
      try {
        const allEvents = await getAllEvents();
        setEvents(formatEvents(allEvents));
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error('Failed to load events. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format events data
  const formatEvents = (eventsData) => {
    return eventsData?.map(event => ({
      ...event,
      date: new Date(event.date)
    }));
  };

  // Prepare filter parameters for the API
  const prepareFilterParams = () => {
    return {
      name: filters.name,
      category: filters.category === 'All' ? null : filters.category,
      city: filters.city || null,
      country: filters.country || null,
      minRating: filters.minRating,
      maxRating: filters.maxRating,
      startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : null,
      endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : null,
      minCapacity: filters.minCapacity,
      maxCapacity: filters.maxCapacity,
      sortBy: filters.sortBy
    };
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Apply filters when filter button is clicked
  const handleApplyFilters = () => {
    fetchEvents();
  };

  // Reset filters to default
  const handleResetFilters = () => {
    const defaultFilters = {
      name: '',
      city: '',
      country: '',
      minRating: 0,
      maxRating: 5,
      startDate: null,
      endDate: null,
      minCapacity: null,
      maxCapacity: null,
      sortBy: 'rating',
      category: 'All'
    };
  
    setFilters(defaultFilters);
    setReset(!reset); // Trigger a re-render to reset filters

    console.log("Filters reset to default values.", filters.name);
  };

  const fetchRegisteredEvents = async () => {
    try {
      const response = await getRegisteredEvents(auth?.user.email);
      const registeredIds = response.map(event => event.id); // Assuming API returns array of event objects
      setRegisteredEventIds(registeredIds);
      console.log("Registered event IDs:", registeredIds);
    } catch (error) {
      console.error('Error fetching registered events:', error);
      toast.error('Failed to load registered events.');
    }
  };
  

  const handleRegisterClick = async (event) => {
    if (!auth?.user) {
      toast.error("You must be logged in to register.");
      return;
    }

    const name = auth?.user.username;
    const email = auth?.user.email;

    try {
      toast.info("Registering...", { autoClose: 2000 });

      const response = await addAttendee(event.id, name, email);
      console.log(response);

      toast.success("Registered Successfully!", { autoClose: 3000 });

      await fetchRegisteredEvents();
    } catch (error) {
      console.error(error);
      toast.error("Failed to register. Try again.");
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
        await fetchRegisteredEvents(); // Refresh the registered event IDs
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to unregister. Try again.");
    }
  };
  
  

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="explore-events-container">
      <h1>Explore Events</h1>
      
      <div className="explore-content">
        <FilterPanel 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
        
        {/* Replace the ENTIRE recommended-section div with this */}
<div className="recommended-section">
  <h2>Recommended For You</h2>
  {recommendedLoading ? (
    <div className="loading">Loading recommendations...</div>
  ) : recommendedEvents.length > 0 ? (
    <Slider {...carouselSettings} className="recommended-carousel">
      {recommendedEvents.map(event => (
        <div key={event.id} className="carousel-item">
          <div className="event-card recommended-card">
            {/* Keep your existing card content below */}
            <h3 className="event-name">{event.name}</h3>
            <div className="event-location">
              {event.city}, {event.country}
            </div>
            <div className="event-date">
              {format(new Date(event.date), 'MMMM dd, yyyy')}
            </div>
            {/* ... rest of your card content ... */}
          </div>
        </div>
      ))}
    </Slider>
  ) : (
    <div className="no-recommendations">
      No recommendations yet. Rate more events to get personalized suggestions!
    </div>
  )}
</div>
        <div className="events-grid">
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : events?.length > 0 ? (
            events?.map(event => (
              <div className="event-card" key={event.id}>
                <h3 className="event-name">{event.name}</h3>
                <div className="event-location">
                  {event.city}, {event.country}
                </div>
                <div className="event-date">
                  {format(new Date(event.date), 'MMMM dd, yyyy')}
                </div>
                <div className="event-rating">
                  <div className="stars">{renderStars(event.averageRating)}</div>
                    <span className="rating-value">Rating: {event.averageRating.toFixed(1)}/5</span>
                    {event?.totalRatings > 0 && (
                      <span className="total-ratings">({event.totalRatings} ratings)</span>
                    )}
                </div>
                {event.capacity && (
                  <div className="event-capacity">
                    <span className="availability">
                      Capacity: {event?.capacity}
                    </span>
                  </div>
                )}
                <div className="event-actions">
                  <Link 
                    className="view-btn" 
                    to={{ pathname: "/viewCommonEvent" }} 
                    state={{ Event: event }}
                  >
                    View
                  </Link>

                  { auth?.user && auth?.user.username === event.username ? (
                    <button 
                      className="unregister-btn"
                      disabled
                    >
                      Created
                    </button>
                  ) : registeredEventIds.includes(event.id) ? (
                    <button 
                      className="unregister-btn"
                      onClick={() => handleUnregisterClick(event)}
                    >
                      Unregister
                    </button>
                  ) : (
                    <button 
                      className="register-btn"
                      onClick={() => handleRegisterClick(event)}
                    >
                      Register
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">No events found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreEvents;