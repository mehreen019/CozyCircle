package com.event_management.event_management_system_backend.repositories;

import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.model.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUsername(String username);
    Optional<Event> findById(Long Id);

    List<Event> findByUsernameAndTimeCategory(String username, String timeCategory);

    // Method to get events by time category and any user
    List<Event> findByTimeCategory(String timeCategory);

    // Find registered events by email and time category
    @Query(value = "SELECT e.* FROM event e " +
            "JOIN attendee a ON e.id = a.eventid " +
            "WHERE a.email = :email " +
            "AND e.time_category = :timeCategory",
            nativeQuery = true)
    List<Event> findRegisteredEventsByEmailAndTimeCategory(@Param("email") String email,
                                                           @Param("timeCategory") String timeCategory);
    
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

    @Query(value = "SELECT e.*, " +
            "COUNT(a.id) as attendee_count, " +
            "e.capacity - COUNT(a.id) as available_capacity, " +
            "RANK() OVER (ORDER BY e.average_rating DESC) as rating_rank, " +
            "RANK() OVER (ORDER BY COUNT(a.id) DESC) as attendee_rank, " +
            "RANK() OVER (ORDER BY e.capacity DESC) as capacity_rank, " +
            "RANK() OVER (ORDER BY (e.capacity - COUNT(a.id)) DESC) as available_capacity_rank " +
            "FROM event e " +
            "LEFT JOIN attendee a ON e.id = a.eventid " +
            "WHERE (:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:city IS NULL OR LOWER(e.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
            "AND (:country IS NULL OR LOWER(e.country) LIKE LOWER(CONCAT('%', :country, '%'))) " +
            "AND (:category IS NULL OR :category = 'All' OR LOWER(e.category) = LOWER(:category)) " +
            "AND (:minRating IS NULL OR e.average_rating >= :minRating) " +
            "AND (:maxRating IS NULL OR e.average_rating <= :maxRating) " +
            "AND (:startDate IS NULL OR e.date >= :startDate) " +
            "AND (:endDate IS NULL OR e.date <= :endDate) " +
            "AND (:minCapacity IS NULL OR e.capacity >= :minCapacity) " +
            "AND (:maxCapacity IS NULL OR e.capacity <= :maxCapacity) " +
            "GROUP BY e.id " +
            "HAVING (:minAvailableCapacity IS NULL OR (e.capacity - COUNT(a.id)) >= :minAvailableCapacity) " +
            "ORDER BY " +
            "CASE WHEN :sortBy = 'rating' THEN e.average_rating ELSE NULL END DESC, " +
            "CASE WHEN :sortBy = 'date' THEN e.date ELSE NULL END ASC, " +
            "CASE WHEN :sortBy = 'capacity' THEN e.capacity ELSE NULL END DESC, " +
            "CASE WHEN :sortBy = 'name' THEN e.name ELSE NULL END ASC, " +
            "e.average_rating DESC",
            nativeQuery = true)
    List<Map<String, Object>> findEventsWithFilters(
            @Param("name") String name,
            @Param("city") String city,
            @Param("country") String country,
            @Param("category") String category,
            @Param("minRating") Double minRating,
            @Param("maxRating") Double maxRating,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("minCapacity") Integer minCapacity,
            @Param("maxCapacity") Integer maxCapacity,
            @Param("minAvailableCapacity") Integer minAvailableCapacity,
            @Param("sortBy") String sortBy
    );

    @Query(value = "SELECT e.* FROM event e " +
            "WHERE MATCH(e.name, e.description) AGAINST(:searchTerm IN BOOLEAN MODE) " +
            "OR SOUNDEX(e.name) = SOUNDEX(:searchTerm) " +
            "OR LEVENSHTEIN_DISTANCE(LOWER(e.name), LOWER(:searchTerm)) <= 3",
            nativeQuery = true)
    List<Event> searchEvents(@Param("searchTerm") String searchTerm);


      /// query using rollup
    @Query(value = "SELECT e.category, COUNT(*) AS eventCount " +
       "FROM event e " +  // Note: lowercase "event" instead of "Event"
       "WHERE e.username = :username " +
       "GROUP BY e.category " +
       "WITH ROLLUP", 
       nativeQuery = true)
List<Object[]> getEventCategoryCountWithRollup(@Param("username") String username);
    
@Query(value = "SELECT e.* FROM event e " +
        "WHERE e.category IN :categories " +
        "AND e.username != :username " +
        "AND e.id NOT IN (" +
        "  SELECT a.eventid FROM attendee a WHERE a.name = :username)",  // ✅ Fixed to `eventid`
        nativeQuery = true)
List<Event> findRecommendedEventsByCategoriesAndUser(
        @Param("categories") List<String> categories,
        @Param("username") String username
);

@Query(value = "SELECT e.* FROM event e " +
"ORDER BY e.average_rating DESC LIMIT 10", nativeQuery = true)
List<Event> findTopRatedEvents();

/// query using cube 
@Query(value = """
        SELECT category, place, COUNT(*) AS eventCount
        FROM event
        WHERE username = :username
        GROUP BY category, place
    
        UNION ALL
    
        SELECT category, NULL AS place, COUNT(*) AS eventCount
        FROM event
        WHERE username = :username
        GROUP BY category
    
        UNION ALL
    
        SELECT NULL AS category, place, COUNT(*) AS eventCount
        FROM event
        WHERE username = :username
        GROUP BY place
    
        UNION ALL
    
        SELECT NULL AS category, NULL AS place, COUNT(*) AS eventCount
        FROM event
        WHERE username = :username
        """, nativeQuery = true)
    List<Object[]> getEventCategoryPlaceCountWithCube(@Param("username") String username);

    // Add these methods to the EventRepository interface

    // Find non-archived events
    List<Event> findByArchivedFalse();

    // Find archived events
    List<Event> findByArchivedTrue();

    // Modify the existing query to consider archived status
    @Query(value = "SELECT e.*, " +
            "COUNT(a.id) as attendee_count, " +
            "e.capacity - COUNT(a.id) as available_capacity, " +
            "RANK() OVER (ORDER BY e.average_rating DESC) as rating_rank, " +
            "RANK() OVER (ORDER BY COUNT(a.id) DESC) as attendee_rank, " +
            "RANK() OVER (ORDER BY e.capacity DESC) as capacity_rank, " +
            "RANK() OVER (ORDER BY (e.capacity - COUNT(a.id)) DESC) as available_capacity_rank " +
            "FROM event e " +
            "LEFT JOIN attendee a ON e.id = a.eventid " +
            "WHERE (:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:city IS NULL OR LOWER(e.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
            "AND (:country IS NULL OR LOWER(e.country) LIKE LOWER(CONCAT('%', :country, '%'))) " +
            "AND (:category IS NULL OR :category = 'All' OR LOWER(e.category) = LOWER(:category)) " +
            "AND (:minRating IS NULL OR e.average_rating >= :minRating) " +
            "AND (:maxRating IS NULL OR e.average_rating <= :maxRating) " +
            "AND (:startDate IS NULL OR e.date >= :startDate) " +
            "AND (:endDate IS NULL OR e.date <= :endDate) " +
            "AND (:minCapacity IS NULL OR e.capacity >= :minCapacity) " +
            "AND (:maxCapacity IS NULL OR e.capacity <= :maxCapacity) " +
            "AND e.archived = :archived " +
            "GROUP BY e.id " +
            "HAVING (:minAvailableCapacity IS NULL OR (e.capacity - COUNT(a.id)) >= :minAvailableCapacity) " +
            "ORDER BY " +
            "CASE WHEN :sortBy = 'rating' THEN e.average_rating ELSE NULL END DESC, " +
            "CASE WHEN :sortBy = 'date' THEN e.date ELSE NULL END ASC, " +
            "CASE WHEN :sortBy = 'capacity' THEN e.capacity ELSE NULL END DESC, " +
            "CASE WHEN :sortBy = 'name' THEN e.name ELSE NULL END ASC, " +
            "e.average_rating DESC",
            nativeQuery = true)
    List<Map<String, Object>> findEventsWithFiltersAndArchiveStatus(
            @Param("name") String name,
            @Param("city") String city,
            @Param("country") String country,
            @Param("category") String category,
            @Param("minRating") Double minRating,
            @Param("maxRating") Double maxRating,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("minCapacity") Integer minCapacity,
            @Param("maxCapacity") Integer maxCapacity,
            @Param("minAvailableCapacity") Integer minAvailableCapacity,
            @Param("sortBy") String sortBy,
            @Param("archived") Boolean archived
    );

    @Query(value = """
    SELECT a.id as admin_id, a.username, a.name, 
           COUNT(e.id) as event_count,
           COALESCE(AVG(er.average_rating), 0.0) as average_event_rating,
           DENSE_RANK() OVER (ORDER BY COALESCE(AVG(er.average_rating), 0.0) DESC) as rating_rank
    FROM admin a
    LEFT JOIN event e ON a.username = e.username
    LEFT JOIN (
        SELECT event_id, AVG(rating) as average_rating
        FROM event_ratings
        GROUP BY event_id
    ) er ON e.id = er.event_id
    GROUP BY a.id, a.username, a.name
    ORDER BY average_event_rating DESC, event_count DESC
    """, nativeQuery = true)
    List<Map<String, Object>> findOrganizersRankedByEventRatings();

}