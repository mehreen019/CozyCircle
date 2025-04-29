package com.event_management.event_management_system_backend.services;

import java.util.ArrayList;
import java.util.List;

import com.event_management.event_management_system_backend.repositories.EventRatingRepository;
import com.event_management.event_management_system_backend.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.event_management.event_management_system_backend.Dto.CategoryCountDto;


@Service
public class EventService {
    
    private final EventRepository eventRepository ;
    
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }
    public List<CategoryCountDto> getEventCategoryCountForUser(String username) {
        List<Object[]> results = eventRepository.getEventCategoryCountWithRollup(username);
        List<CategoryCountDto> categoryCountDtos = new ArrayList<>();
        
        for (Object[] result : results) {
            String category = (result[0] == null) ? "Total" : (String) result[0];
            Long count = ((Number) result[1]).longValue();
            categoryCountDtos.add(new CategoryCountDto(category, count));
        }
        
        return categoryCountDtos;
    }
}