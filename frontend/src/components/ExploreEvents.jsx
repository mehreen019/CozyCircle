import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { 
  getAllEvents, 
  addAttendee, 
  filterEvents, 
  getRegisteredEvents, 
  unregisterUser,
  getArchivedEvents,
  filterArchivedEvents,
  triggerArchiving
} from '../helpers/api_communicator';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterPanel from './FilterPanel';
import '../styles/ExploreEvents.css';

const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archivedLoading, setArchivedLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
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
      fetchArchivedEvents();
      setReset(false); // Reset the reset state after fetching events
    }
  }, [auth, navigate, reset]);

  // Second useEffect to handle registered events fetch
  useEffect(() => {
    if (auth?.user) {
      fetchRegisteredEvents();
    }
  }, [auth?.user?.email]); 

  // Fetch recommended events
  useEffect(() => {
    const fetchRecommendedEvents = async () => {
      if (!auth?.user?.username) return;
      
      try {
        const response = await fetch(
          `http://localhost:8081/events/recommended?username=${auth.user.username}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
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
      const filterParams = prepareFilterParams();
      const response = await filterEvents(filterParams);
      setEvents(formatEvents(response));
    } catch (error) {
      console.error('Error fetching events:', error);
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

  // Function to fetch archived events
  const fetchArchivedEvents = async () => {
    setArchivedLoading(true);
    try {
      const filterParams = prepareFilterParams();
      const response = await filterArchivedEvents(filterParams);
      setArchivedEvents(formatEvents(response));
    } catch (error) {
      console.error('Error fetching archived events:', error);
      try {
        const allArchivedEvents = await getArchivedEvents();
        setArchivedEvents(formatEvents(allArchivedEvents));
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error('Failed to load archived events. Please try again later.');
      }
    } finally {
      setArchivedLoading(false);
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
    if (showArchived) {
      fetchArchivedEvents();
    }
  };

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % recommendedEvents.length);
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
  };

  const fetchRegisteredEvents = async () => {
    try {
      const response = await getRegisteredEvents(auth?.user.email);
      const registeredIds = response.map(event => event.id);
      setRegisteredEventIds(registeredIds);
    } catch (error) {
      console.error('Error fetching registered events:', error);
      toast.error('Failed to load registered events.');
    }
  };
  
  const handleToggleArchived = () => {
    setShowArchived(!showArchived);
    if (!showArchived && archivedEvents.length === 0) {
      fetchArchivedEvents();
    }
  };

  const handleManualArchive = async () => {
    try {
      const result = await triggerArchiving();
      toast.success(result.result || "Archiving completed successfully");
      fetchEvents();
      fetchArchivedEvents();
    } catch (error) {
      console.error('Error triggering manual archive:', error);
      toast.error('Failed to run archiving process');
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
        await fetchRegisteredEvents();
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

  // Render event card
  const renderEventCard = (event, isArchived) => (
    <div className={`event-card ${isArchived ? 'archived' : ''}`} key={event.id}>
      {isArchived && <div className="archived-badge">Archived</div>}
      <h3 className="event-name">{event.name}</h3>
      <div className="event-location">{event.city}, {event.country}</div>
      <div className="event-date">{format(new Date(event.date), 'MMMM dd, yyyy')}</div>
      <div className="event-rating">
        <div className="stars">{renderStars(event.averageRating)}</div>
        <span className="rating-value">Rating: {event.averageRating?.toFixed(1) ?? event.avergae_rating?.toFixed(1) ?? 0}/5</span>
        {event.totalRatings > 0 && (
          <span className="total-ratings">({event.totalRatings} ratings)</span>
        )}
      </div>
      {(
        <div className="event-capacity">Capacity: {event?.capacity ?? 0}</div>
      )}
      <div className="event-actions">
        <Link className="view-btn" to={{ pathname: "/viewCommonEvent" }} state={{ Event: event }}>
          View
        </Link>
        {!isArchived && auth?.user && auth?.user.username === event.username ? (
          <button className="unregister-btn" disabled>Created</button>
        ) : !isArchived && registeredEventIds.includes(event.id) ? (
          <button className="unregister-btn" onClick={() => handleUnregisterClick(event)}>Unregister</button>
        ) : !isArchived && (
          <button className="register-btn" onClick={() => handleRegisterClick(event)}>Register</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="explore-events-container">
      <h1>Explore Events</h1>
  
      <div className="explore-content">
        {/* LEFT COLUMN */}
        <div className="left-panel">
          {/* Recommendations */}
          <div className="recommendation-section fun-card-wrapper">
            <h2 className="recommendation-heading">Recommended For You</h2>
            {recommendedLoading ? (
              <div className="loading-recommendations">Loading...</div>
            ) : recommendedEvents.length === 0 ? (
              <div className="no-recommendations">
                Rate more events to get personalized suggestions!
              </div>
            ) : (
              <div className="recommendation-card-wrapper">
                {/* Display current event */}
                <div className="recommendation-item">
                  <h3 className="rec-event-name">{recommendedEvents[currentEventIndex]?.name}</h3>
                  <div className="rec-event-location">
                    {recommendedEvents[currentEventIndex]?.city}, {recommendedEvents[currentEventIndex]?.country}
                  </div>
                  <div className="rec-event-date">
                    {format(new Date(recommendedEvents[currentEventIndex]?.date), 'MMMM dd, yyyy')}
                  </div>
                  <div className="rec-event-rating">
                    <div className="stars">
                      {renderStars(recommendedEvents[currentEventIndex]?.rating || 0)}
                    </div>
                    <span className="rating-value">
                      {(recommendedEvents[currentEventIndex]?.rating || 0).toFixed(1)}/5
                    </span>
                  </div>
                  <Link
                    className="view-rec-btn"
                    to={{ pathname: "/viewCommonEvent" }}
                    state={{ Event: recommendedEvents[currentEventIndex] }}
                  >
                    View Details
                  </Link>
                </div>

                {/* Next Button */}
                {recommendedEvents.length > 1 && (
                  <button className="next-btn" onClick={handleNextEvent}>
                    Next Event
                  </button>
                )}
              </div>
            )}
          </div>
  
          {/* Filter Panel */}
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
          
          {/* Archived Events Toggle */}
          <div className="archived-controls">
            <button 
              className={`archive-toggle-btn ${showArchived ? 'active' : ''}`} 
              onClick={handleToggleArchived}
            >
              {showArchived ? 'Hide Archived Events' : 'Show Archived Events'}
            </button>
           
              <button className="manual-archive-btn" onClick={handleManualArchive}>
                Archive Old Events Now
              </button>
           
          </div>
        </div>
  
        {/* RIGHT COLUMN */}
        <div className="events-content">
          {/* Current Events Section */}
          {!showArchived && (
            <div>
            <h1 className="section-title">Upcoming Events</h1>
            <div className="events-grid">
              
              {loading ? (
                <div className="loading">Loading events...</div>
              ) : events?.length > 0 ? (
                events
                  .filter(event => !archivedEvents.some(archived => archived.id === event.id))
                  .map(event => renderEventCard(event, false))

              ) : (
                <div className="no-events">No events found matching your criteria.</div>
              )}
            </div>
            </div>
          )}
          
          {/* Archived Events Section */}
          {showArchived && (
            <div>
            <h2 className="section-title">Archived Events</h2>
            <div className="events-grid archived-grid">
              
              {archivedLoading ? (
                <div className="loading">Loading archived events...</div>
              ) : archivedEvents?.length > 0 ? (
                archivedEvents.map(event => renderEventCard(event, true))
              ) : (
                <div className="no-events">No archived events found.</div>
              )}
            </div>
            </div> 
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreEvents;