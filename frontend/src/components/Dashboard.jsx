

import { useState, useEffect } from 'react'
import { useAuth} from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, request } from '../helpers/axios_helper';
import { getEvents, getRegisteredEvents } from '../helpers/api_communicator';
import NavigationLink from './shared/NavigationLink';
import { Link } from "react-router-dom";

import { format } from "date-fns";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('created');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const auth = useAuth();

  console.log("Auth token:", getAuthToken());
  console.log("Auth user:", auth.user);

  useEffect(() => {
    console.log("Dashboard useEffect - auth user:", auth.user);
    if (!auth?.user) {
      return navigate("*");
    } else {
      loadEvents();
      loadRegisteredEvents();
    }
  }, [auth, navigate]);

  const loadEvents = async () => {
    try {
      console.log("Loading created events...");
      const response = await getEvents();
      console.log("Created events response:", response);
      
      if (response && Array.isArray(response)) {
        const events = response.map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        console.log("Processed created events:", events);
        setEvents(events);
      } else {
        console.error("Unexpected response format for created events:", response);
        setError("Invalid response format for created events");
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setError("Failed to load created events: " + error.message);
    }
  }

  const loadRegisteredEvents = async () => {
    try {
      if (auth.user && auth.user.email) {
        console.log("Loading registered events for email:", auth.user.email);
        const response = await getRegisteredEvents(auth.user.email);
        console.log("Registered events response:", response);
        
        if (response && Array.isArray(response)) {
          const events = response.map(event => ({
            ...event,
            date: new Date(event.date)
          }));
          console.log("Processed registered events:", events);
          setRegisteredEvents(events);
        } else {
          console.error("Unexpected response format for registered events:", response);
          setError("Invalid response format for registered events");
        }
      } else {
        console.error("Cannot load registered events: User email not available", auth.user);
        setError("User email not available");
      }
    } catch (error) {
      console.error('Error loading registered events:', error);
      setError("Failed to load registered events: " + error.message);
    }
  };

  const onDelete = async (id) => {
    await request("DELETE", `/delete/${id}`, {});
    loadEvents();
  };

  const renderEventsTable = (eventsToRender) => {
    if (!eventsToRender || eventsToRender.length === 0) {
      return (
        <div className="container">
          <div className="alert alert-info">
            No events found. {activeTab === 'created' ? 'Create your first event!' : 'Register for events to see them here!'}
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="py-4">
          <table className="table border shadow">
            <thead>
              <tr>
                <th scope="col">S.N</th>
                <th scope="col">Name</th>
                <th scope="col">City</th>
                <th scope="col">Country</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventsToRender.map((event, index) => {
                // Make sure the date is a Date object
                const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
                return (
                  <tr key={index}>
                    <th scope="row">
                      {index + 1}
                    </th>
                    <td>{event.name}</td>
                    <td>{event.city}</td>
                    <td>{event.country}</td>
                    <td>{format(eventDate, "MMMM do, yyyy")}</td>
                    <td>
                      <Link
                        className="btn mx-2 btn-secondary btn-outline-light"
                        to={{
                          pathname: "/viewEvent",
                        }}
                        state={{Event: event}}
                      >
                        View
                      </Link>
                      {activeTab === 'created' && (
                        <>
                          <Link
                            className="btn btn-outline-primary mx-2 btn-outline-dark"
                            to={{
                              pathname: "/editEvent",
                            }}
                            state={{Event: event}}
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-danger mx-2"
                            onClick={ ()=> onDelete(event.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{color: 'black', marginBottom:'24px'}}>Dashboard </h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <NavigationLink
          bg="#AE9D99"
          to="/addEvent"
          text="Add Event"
          textColor="black"
        />
        <NavigationLink
          bg="#8A7B77"
          to="/events/analytics"
          text="View Analytics"
          textColor="white"
        />
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="tabs" style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('created')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px', 
            backgroundColor: activeTab === 'created' ? '#AE9D99' : '#eee',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Created Events
        </button>
        <button 
          onClick={() => setActiveTab('registered')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'registered' ? '#AE9D99' : '#eee',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Registered Events
        </button>
      </div>

      {activeTab === 'created' ? renderEventsTable(events) : renderEventsTable(registeredEvents)}
    </div>
  )
}

export default Dashboard

//onClick={()=> setAddButtonPopup(true)}  
//<AddEvent trigger={addButtonPopup} setTrigger={setAddButtonPopup}></AddEvent>
