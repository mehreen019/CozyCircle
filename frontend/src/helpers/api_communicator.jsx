import axios from "axios";
import { request, setAuthHeader } from "./axios_helper";

export const filterEvents = async (filterParams) => {
  console.log("Filtering events with params:", filterParams);
  try {
    const res = await request("POST", "/events/filter", filterParams);
    
    if (res.status !== 200) {
      throw new Error(`Failed to filter events: ${res.status}`);
    }
    
    console.log("Filtered events:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error filtering events:", error);
    throw error;
  }
};

// Create search events API function
export const searchEvents = async (searchTerm) => {
  console.log("Searching events with term:", searchTerm);
  try {
    const res = await request(`GET`, `/events/search?term=${encodeURIComponent(searchTerm)}`);
    
    if (res.status !== 200) {
      throw new Error(`Failed to search events: ${res.status}`);
    }
    
    return res.data;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
};

export const addAttendee = async (eventid, name, email) => {
  console.log("reached api "+ name + " eventid: "+ eventid)
  const res = await request("POST","/addattendee", {eventid, name, email});
  if(res.status != 200)
  {
      throw new Error("Unable to register for event");
  }

  const data = await res.data;
  return data;
};

export const unregisterUser = async (eventId, email) => {
  console.log("reached api "+ email + " eventid: "+ eventId)
  const res = await request("DELETE",`/unregister?eventId=${eventId}&email=${email}`, {});
  if(res.status != 200)
  {
      throw new Error("Unable to unregister for event");
  }

  return res;
};

export const getAttendees = async (route) => {
  console.log("reached getattendees ")
  const res = await request("GET",route, {});
  if(res.status != 200)
  {
      throw new Error("Unable to get attendees");
  }

  const data = await res.data;
  return data;
};

export const addEvent = async (name, username, description, place, city, country, date,userId,rating,capacity, category) => {
  console.log("reached api "+ username + " date: "+ date)
  const res = await request("POST","/addevent", {name, username, description, place, city, country, date,userId,rating,capacity, category});
  if(res.status != 200)
  {
      throw new Error("Unable to add event");
  }

  const data = await res.data;
  return data;
};


export const updateEvent = async (route, name, username, description, place, city, country, date, category) => {
  console.log("reached api "+ username + " date: "+ date)
  const res = await request("PUT",route, {name, username, description, place, city, country, date, category});
  if(res.status != 200)
  {
      throw new Error("Unable to add event");
  }

  const data = await res.data;
  return data;
};


export const getEvents = async () => {
  console.log("Fetching created events");
  try {
    const res = await request("GET", "/getevent", {});
    if (res.status === 200) {
      console.log("Successfully fetched created events:", res.data);
      console.log("Events:", res.data);
      return res.data;
    } else {
      console.error("Error fetching events. Status:", res.status);
      throw new Error(`Unable to get events: ${res.status}`);
    }
  } catch (error) {
    console.error("Exception while fetching events:", error);
    throw new Error(error.message || "Unable to get events");
  }
};

export const getEventsByTimeCategory = async (timeCategory) => {
  console.log(`Fetching ${timeCategory} events`);
  try {
    const res = await request("GET", `/events/time-category/${timeCategory}`, {});
    if (res.status === 200) {
      console.log(`Successfully fetched ${timeCategory} events:`, res.data);
      return res.data;
    } else {
      console.error(`Error fetching ${timeCategory} events. Status:`, res.status);
      throw new Error(`Unable to get ${timeCategory} events: ${res.status}`);
    }
  } catch (error) {
    console.error(`Exception while fetching ${timeCategory} events:`, error);
    throw new Error(error.message || `Unable to get ${timeCategory} events`);
  }
};

export const getAllEvents = async () => {
  console.log("reached getevents ")
  const res = await request("GET","/getallevents", {});
  if(res.status != 200)
  {
      throw new Error("Unable to get events");
  }

  const data = await res.data;
  return data;
};

export const loginUser = async (username, password) => {
    
    const res = await request("POST","/login", {username, password});
    if(res.status != 200)
    {
        setAuthHeader(null);
        throw new Error("Unable to login");
    }

    setAuthHeader(res.data.token)
    const data = await res.data;
    return data;
};

export const logoutUser = async () => {
    const res = await axios.get("/user/logout");
     //const res = "hi";
     if (res.status !== 200) {
       throw new Error("Unable to log out ");
     }
     setAuthHeader(null)
     const data = await res.data;
     //return "hiii , how can";
     return data;
};


export const signupUser = async (
    name,
    username,
    email,
    password
  ) => {
    console.log(username)

    const res = await request("POST", "/register", { name, username, email, password });
    if (res.status !== 201) {
      setAuthHeader(null);
      console.log("new error encountered")
      throw new Error("Unable to Signup");
    }

    setAuthHeader(res.data.token)
    const data = await res.data;
    return data;
};
  
export const getTotalRatings = async (eventId) => {
  console.log("reached gettotalratings "+ eventId)
  const res = await request("GET", `/count/${eventId}`, {});
  if(res.status != 200)
  {
      throw new Error("Unable to get total ratings");
  }

  const data = await res.data;
  return data;
};

export const getRegisteredEvents = async (email) => {
  console.log("Fetching registered events for", email);
  try {
    if (!email) {
      console.error("Email is empty or undefined");
      throw new Error("Email is required to fetch registered events");
    }
    
    const res = await request("GET", `/registered-events?email=${email}`, {});
    if (res.status === 200) {
      console.log("Successfully fetched registered events:", res.data);
      return res.data;
    } else {
      console.error("Error fetching registered events. Status:", res.status);
      throw new Error(`Unable to get registered events: ${res.status}`);
    }
  } catch (error) {
    console.error("Exception while fetching registered events:", error);
    throw new Error(error.message || "Unable to get registered events");
  }
};

export const getRegisteredEventsByTimeCategory = async (email, timeCategory) => {
  console.log(`Fetching registered ${timeCategory} events for ${email}`);
  try {
    if (!email) {
      console.error("Email is empty or undefined");
      throw new Error("Email is required to fetch registered events");
    }
    
    const res = await request("GET", `/registered-events/time-category/${timeCategory}?email=${email}`, {});
    if (res.status === 200) {
      console.log(`Successfully fetched registered ${timeCategory} events:`, res.data);
      return res.data;
    } else {
      console.error(`Error fetching registered ${timeCategory} events. Status:`, res.status);
      throw new Error(`Unable to get registered ${timeCategory} events: ${res.status}`);
    }
  } catch (error) {
    console.error(`Exception while fetching registered ${timeCategory} events:`, error);
    throw new Error(error.message || `Unable to get registered ${timeCategory} events`);
  }
};

export const getUserRatingForEvent = async (eventId, userId) => {
  console.log("Fetching user rating for event ID:", eventId, "and user ID:", userId);
  try {
    const res = await request("GET", `/events/${eventId}/user-rating?userId=${userId}`, {});
    if (res.status === 200) {
      console.log("Successfully fetched user rating:", res.data);
      return res.data;
    } else {
      console.error("Error fetching user rating. Status:", res.status);
      throw new Error(`Unable to get user rating: ${res.status}`);
    }
  } catch (error) {
    console.error("Exception while fetching user rating:", error);
    throw new Error(error.message || "Unable to get user rating");
  }
};




