import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getAuthToken, request } from '../helpers/axios_helper';
import { getEvents } from '../helpers/api_communicator';
import NavigationLink from './shared/NavigationLink';
import { format } from "date-fns";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    } else {
      loadEvents();
    }
  }, [auth, navigate]);

  const loadEvents = async () => {
    try {
      const response = await getEvents();
      const fetchedEvents = response.map(event => ({
        ...event,
        date: new Date(event.date) // Assuming event.date is timestamp or ISO string
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const onDelete = async (id) => {
    await request("DELETE", `/delete/${id}`, {});
    loadEvents();
  };

  const getCategoryData = () => {
    const categoryCount = {};

    events.forEach(event => {
      const category = event.category || 'Unknown';
      if (categoryCount[category]) {
        categoryCount[category]++;
      } else {
        categoryCount[category] = 1;
      }
    });

    const data = Object.keys(categoryCount).map(key => ({
      name: key,
      value: categoryCount[key]
    }));

    return data;
  };

  const pieData = getCategoryData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6699', '#66CCFF', '#99FF66', '#FF9966'];

  return (
    <div>
      <h1 style={{ color: 'black', marginBottom: '24px' }}>Dashboard</h1>

      <NavigationLink
        bg="#AE9D99"
        to="/addEvent"
        text="Add Event"
        textColor="black"
      />

      {/* Event List Table */}
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
              {events.map((event, index) => (
                <tr key={event.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{event.name}</td>
                  <td>{event.city}</td>
                  <td>{event.country}</td>
                  <td>{format(event.date, "MMMM do, yyyy")}</td>
                  <td>
                    <Link
                      className="btn mx-2 btn-secondary btn-outline-light"
                      to={{
                        pathname: "/viewEvent",
                      }}
                      state={{ Event: event }}
                    >
                      View
                    </Link>
                    <Link
                      className="btn btn-outline-primary mx-2 btn-outline-dark"
                      to={{
                        pathname: "/editEvent",
                      }}
                      state={{ Event: event }}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => onDelete(event.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pie Chart Section */}
      {pieData.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Event Categories Overview</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
