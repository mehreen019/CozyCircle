package com.event_management.event_management_system_backend.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.model.EventRating;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRatingRepository extends JpaRepository<EventRating, Long> {
    // Correct method signature without static and implementation.
    Optional<EventRating> findByEventIdAndUserId(Long eventId, Long userId);

    // Custom query to calculate the average rating for an event
    @Query("SELECT COALESCE(AVG(e.rating), 0) FROM EventRating e WHERE e.event.id = :eventId")
    double calculateAverageRating(@Param("eventId") Long eventId);

    // Custom query to count the number of ratings for a specific event
    @Query("SELECT COUNT(e) FROM EventRating e WHERE e.event.id = :eventId")
    long countRatingsByEventId(@Param("eventId") Long eventId);
    
    // Count ratings provided by a specific user
    @Query("SELECT COUNT(e) FROM EventRating e WHERE e.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);



    @Query(value = 
    "SELECT e.category " +
    "FROM event_ratings er " +
    "JOIN event e ON er.event_id = e.id " +
    "JOIN admin a ON er.user_id = a.id " +
    "WHERE a.username = :username AND er.rating >= 4.0 " +
    "GROUP BY e.category " +
    "ORDER BY COUNT(er.rating) DESC",
    nativeQuery = true)
    List<String> findTopRatedCategoriesByUser(@Param("username") String username);

    @Query(value = """
        SELECT * FROM event e
        WHERE e.category IN (
            SELECT er.event_category
            FROM event_ratings er
            JOIN admin u ON u.id = er.user_id
            WHERE u.username = :username AND er.rating >= 4.0
            GROUP BY er.event_category
            ORDER BY COUNT(er.rating) DESC
            LIMIT 5  -- Optional: Limit to top categories
        )
        AND e.username != :username
        AND e.id NOT IN (
            SELECT a.eventid FROM attendee a WHERE a.name = :username  // ✅ Corrected to `eventid`
        )
        """, nativeQuery = true)
    List<Event> findRecommendedEvents(@Param("username") String username);

}
