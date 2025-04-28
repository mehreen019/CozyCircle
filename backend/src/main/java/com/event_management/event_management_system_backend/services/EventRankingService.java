package com.event_management.event_management_system_backend.services;

import com.event_management.event_management_system_backend.Dto.EventRankingDto;
import com.event_management.event_management_system_backend.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventRankingService {
    private final EventRepository eventRepository;

    /**
     * Get events ranked by average rating using SQL RANK() function
     */
    public List<EventRankingDto> getEventsRankedByRating() {
        List<Map<String, Object>> rankedEvents = eventRepository.findAllEventsRankedByRating();
        return convertToEventRankingDto(rankedEvents);
    }

    /**
     * Get events ranked by attendee count using SQL RANK() function
     */
    public List<EventRankingDto> getEventsRankedByAttendeeCount() {
        List<Map<String, Object>> rankedEvents = eventRepository.findAllEventsRankedByAttendeeCount();
        return convertToEventRankingDto(rankedEvents);
    }

    /**
     * Get events ranked by total capacity using SQL RANK() function
     */
    public List<EventRankingDto> getEventsRankedByCapacity() {
        List<Map<String, Object>> rankedEvents = eventRepository.findAllEventsRankedByCapacity();
        return convertToEventRankingDto(rankedEvents);
    }

    /**
     * Get events ranked by available capacity using SQL RANK() function
     */
    public List<EventRankingDto> getEventsRankedByAvailableCapacity() {
        List<Map<String, Object>> rankedEvents = eventRepository.findAllEventsRankedByAvailableCapacity();
        return convertToEventRankingDto(rankedEvents);
    }

    /**
     * Get events with all rankings using SQL RANK() function
     */
    public List<EventRankingDto> getEventsWithAllRankings() {
        List<Map<String, Object>> rankedEvents = eventRepository.findAllEventsWithAllRankings();
        return convertToEventRankingDto(rankedEvents);
    }

    /**
     * Convert database query results to DTOs - made public for reuse
     */
    public List<EventRankingDto> convertToEventRankingDto(List<Map<String, Object>> rankedEvents) {
        return rankedEvents.stream().map(event -> {
            EventRankingDto dto = new EventRankingDto();

            // Map basic event properties
            dto.setId(((Number) event.get("id")).longValue());
            dto.setName((String) event.get("name"));
            dto.setUsername((String) event.get("username"));
            dto.setCity((String) event.get("city"));
            dto.setCountry((String) event.get("country"));
            dto.setPlace((String) event.get("place"));
            dto.setDescription((String) event.get("description"));
            dto.setDate((Date) event.get("date"));
            dto.setAverageRating(((Number) event.get("average_rating")).doubleValue());
            dto.setCapacity(((Number) event.get("capacity")).intValue());
            dto.setTotal_ratings(((Number) event.get("total_ratings")).intValue());
            dto.setCategory((String) event.get("category"));

            // Map ranking properties if they exist
            if (event.containsKey("rating_rank")) {
                dto.setRatingRank(((Number) event.get("rating_rank")).intValue());
            }

            if (event.containsKey("attendee_count")) {
                dto.setAttendeeCount(((Number) event.get("attendee_count")).intValue());
            }

            if (event.containsKey("attendee_rank")) {
                dto.setAttendeeRank(((Number) event.get("attendee_rank")).intValue());
            }

            if (event.containsKey("capacity_rank")) {
                dto.setCapacityRank(((Number) event.get("capacity_rank")).intValue());
            }

            if (event.containsKey("available_capacity")) {
                dto.setAvailableCapacity(((Number) event.get("available_capacity")).intValue());
            }

            if (event.containsKey("available_capacity_rank")) {
                dto.setAvailableCapacityRank(((Number) event.get("available_capacity_rank")).intValue());
            }

            return dto;
        }).collect(Collectors.toList());
    }
} 