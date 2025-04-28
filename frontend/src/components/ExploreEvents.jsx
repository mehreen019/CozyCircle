import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { getAllEvents, addAttendee, filterEvents } from '../helpers/api_communicator';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterPanel from './FilterPanel';
import '../styles/ExploreEvents.css';

const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!auth?.user) {
      navigate('/login');
    } else {
      // Initial load
      fetchEvents();
    }
  }, [auth, navigate]);

  // Function to fetch events based on the applied filters
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // If a search term is provided, use the search endpoint
      /*if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const response = await searchEvents(filters.searchTerm);
        setEvents(formatEvents(response));
      } else {*/
        // Otherwise use the filter endpoint with the current filter state 
        const filterParams = prepareFilterParams();
        const response = await filterEvents(filterParams);
        console.log("Filtered events:", response);
        setEvents(formatEvents(response));
      //}
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
    setFilters({
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
    
    // After resetting filters, fetch all events again
    fetchEvents();
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to register. Try again.");
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
                  <button 
                    className="register-btn"
                    onClick={() => handleRegisterClick(event)}
                  >
                    Register
                  </button>
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