import React, { useState } from 'react';
import axios from 'axios';

function EventForm() {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [place, setPlace] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [capacity, setCapacity] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const eventData = {
            name,
            city,
            country,
            place,
            description,
            date,
            capacity
        };

        axios.post('/api/events', eventData)
            .then(response => {
                console.log('Event created successfully:', response.data);
            })
            .catch(error => {
                console.error('There was an error creating the event!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Event Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="country">Country:</label>
                <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="place">Place:</label>
                <input
                    type="text"
                    id="place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="capacity">Capacity:</label>
                <input
                    type="number"
                    id="capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />
            </div>
            <button type="submit">Create Event</button>
        </form>
    );
}

export default EventForm; 