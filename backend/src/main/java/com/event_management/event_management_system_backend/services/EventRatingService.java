package com.event_management.event_management_system_backend.services;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.repositories.EventRatingRepository;
import com.event_management.event_management_system_backend.repositories.EventRepository;

@Service
public class EventRatingService {

    private final EventRatingRepository eventRatingRepository;
    private final EventRepository eventRepository;

    public EventRatingService(EventRatingRepository eventRatingRepository,EventRepository eventRepository) {
        this.eventRatingRepository = eventRatingRepository;
        this.eventRepository = eventRepository;
    }

    public long getTotalCountOfRatings(Long eventId) {
        return eventRatingRepository.countRatingsByEventId(eventId);
    }
    public List<Event> recommendEvents(String username) {
        List<String> topCategories = eventRatingRepository.findTopRatedCategoriesByUser(username);
        if (topCategories == null || topCategories.isEmpty()) {
            // If no categories are passed, return top-rated events
            return eventRepository.findTopRatedEvents();
        } else {
            //return eventRepository.findTopRatedEvents();
       return eventRepository.findRecommendedEventsByCategoriesAndUser(topCategories, username);
    }
    
    }
}
