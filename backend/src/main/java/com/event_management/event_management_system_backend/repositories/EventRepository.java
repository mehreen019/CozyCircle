package com.event_management.event_management_system_backend.repositories;

import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.model.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUsername(String username);
     Optional<Event> findById(Long Id);
    
    // SQL query using RANK() to get events ranked by average rating
    @Query(value = "SELECT e.*, " +
           "RANK() OVER (ORDER BY e.average_rating DESC) as rating_rank " +
           "FROM event e " +
           "ORDER BY rating_rank", nativeQuery = true)
    List<Map<String, Object>> findAllEventsRankedByRating();
    
    // SQL query using RANK() to get events ranked by attendee count
    @Query(value = "SELECT e.*, " +
           "COUNT(a.id) as attendee_count, " +
           "RANK() OVER (ORDER BY COUNT(a.id) DESC) as attendee_rank " +
           "FROM event e " +
           "LEFT JOIN attendee a ON e.id = a.eventid " +
           "GROUP BY e.id " +
           "ORDER BY attendee_rank", nativeQuery = true)
    List<Map<String, Object>> findAllEventsRankedByAttendeeCount();
    
    // SQL query using RANK() to get events ranked by total capacity
    @Query(value = "SELECT e.*, " +
           "RANK() OVER (ORDER BY e.capacity DESC) as capacity_rank " +
           "FROM event e " +
           "ORDER BY capacity_rank", nativeQuery = true)
    List<Map<String, Object>> findAllEventsRankedByCapacity();
    
    // SQL query using RANK() to get events ranked by available capacity (capacity left)
    @Query(value = "SELECT e.*, " +
           "e.capacity - COUNT(a.id) as available_capacity, " +
           "RANK() OVER (ORDER BY (e.capacity - COUNT(a.id)) DESC) as available_capacity_rank " +
           "FROM event e " +
           "LEFT JOIN attendee a ON e.id = a.eventid " +
           "GROUP BY e.id " +
           "ORDER BY available_capacity_rank", nativeQuery = true)
    List<Map<String, Object>> findAllEventsRankedByAvailableCapacity();
    
    // Comprehensive SQL query with all rankings in one request
    @Query(value = "SELECT e.*, " +
           "COUNT(a.id) as attendee_count, " +
           "e.capacity - COUNT(a.id) as available_capacity, " +
           "RANK() OVER (ORDER BY e.average_rating DESC) as rating_rank, " +
           "RANK() OVER (ORDER BY COUNT(a.id) DESC) as attendee_rank, " +
           "RANK() OVER (ORDER BY e.capacity DESC) as capacity_rank, " +
           "RANK() OVER (ORDER BY (e.capacity - COUNT(a.id)) DESC) as available_capacity_rank " +
           "FROM event e " +
           "LEFT JOIN attendee a ON e.id = a.eventid " +
           "GROUP BY e.id", nativeQuery = true)
    List<Map<String, Object>> findAllEventsWithAllRankings();
}


