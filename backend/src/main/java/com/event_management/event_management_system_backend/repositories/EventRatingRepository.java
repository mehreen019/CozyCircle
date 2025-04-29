package com.event_management.event_management_system_backend.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.event_management.event_management_system_backend.model.EventRating;
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
}
