import { request } from "./axios_helper";

export const getAllEventRankings = async () => {
  console.log("Fetching all event rankings");
  const res = await request("GET", "/events/ranked/all", {});
  if(res.status !== 200) {
    throw new Error("Unable to get event rankings");
  }
  return res.data;
};

export const getEventsByRating = async () => {
  console.log("Fetching events ranked by rating");
  const res = await request("GET", "/events/ranked/ratings", {});
  if(res.status !== 200) {
    throw new Error("Unable to get events ranked by rating");
  }
  return res.data;
};

export const getEventsByAttendees = async () => {
  console.log("Fetching events ranked by attendee count");
  const res = await request("GET", "/events/ranked/attendees", {});
  if(res.status !== 200) {
    throw new Error("Unable to get events ranked by attendees");
  }
  return res.data;
};

export const getEventsByCapacity = async () => {
  console.log("Fetching events ranked by capacity");
  const res = await request("GET", "/events/ranked/capacity", {});
  if(res.status !== 200) {
    throw new Error("Unable to get events ranked by capacity");
  }
  return res.data;
};

export const getEventsByAvailableCapacity = async () => {
  console.log("Fetching events ranked by available capacity");
  const res = await request("GET", "/events/ranked/available-capacity", {});
  if(res.status !== 200) {
    throw new Error("Unable to get events ranked by available capacity");
  }
  return res.data;
}; 