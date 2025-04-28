package com.event_management.event_management_system_backend.services;
import org.springframework.stereotype.Service;
import com.event_management.event_management_system_backend.repositories.EventRatingRepository;

@Service
public class EventRatingService {

    private final EventRatingRepository eventRatingRepository;

    public EventRatingService(EventRatingRepository eventRatingRepository) {
        this.eventRatingRepository = eventRatingRepository;
    }

    public long getTotalCountOfRatings(Long eventId) {
        return eventRatingRepository.countRatingsByEventId(eventId);
    }
}
