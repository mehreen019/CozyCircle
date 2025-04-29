package com.event_management.event_management_system_backend.services;

import com.event_management.event_management_system_backend.Dto.EventFilterDto;
import com.event_management.event_management_system_backend.Dto.EventRankingDto;
import com.event_management.event_management_system_backend.repositories.EventRepository;
import com.event_management.event_management_system_backend.services.EventRankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventFilterService {
    private final EventRepository eventRepository;
    private final EventRankingService eventRankingService;

    /**
     * Filter events based on multiple criteria
     */
    public List<EventRankingDto> filterEvents(EventFilterDto filterDto) {
        List<Map<String, Object>> filteredEvents = eventRepository.findEventsWithFilters(
                filterDto.getName(),
                filterDto.getCity(),
                filterDto.getCountry(),
                filterDto.getCategory(),
                filterDto.getMinRating(),
                filterDto.getMaxRating(),
                filterDto.getStartDate(),
                filterDto.getEndDate(),
                filterDto.getMinCapacity(),
                filterDto.getMaxCapacity(),
                filterDto.getMinAvailableCapacity(),
                filterDto.getSortBy()
        );

        return eventRankingService.convertToEventRankingDto(filteredEvents);
    }

    /**
     * Search events with fuzzy matching
     */
    public List<EventRankingDto> searchEvents(String searchTerm) {
        // Implement fuzzy search logic
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return eventRankingService.getEventsWithAllRankings();
        }

        // Convert basic events to EventRankingDto
        List<EventRankingDto> searchResults = eventRepository.searchEvents(searchTerm)
                .stream()
                .map(event -> {
                    EventRankingDto dto = new EventRankingDto();
                    dto.setId(event.getId());
                    dto.setName(event.getName());
                    dto.setUsername(event.getUsername());
                    dto.setCity(event.getCity());
                    dto.setCountry(event.getCountry());
                    dto.setPlace(event.getPlace());
                    dto.setDescription(event.getDescription());
                    dto.setDate(event.getDate());
                    dto.setAverageRating(event.getRating());
                    dto.setCapacity(event.getCapacity());
                    dto.setTotal_ratings(event.getTotal_ratings());
                    return dto;
                })
                .collect(Collectors.toList());

        return searchResults;
    }
}