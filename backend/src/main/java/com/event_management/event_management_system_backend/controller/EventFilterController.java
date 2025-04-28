package com.event_management.event_management_system_backend.controller;

import com.event_management.event_management_system_backend.Dto.EventFilterDto;
import com.event_management.event_management_system_backend.Dto.EventRankingDto;
import com.event_management.event_management_system_backend.services.EventFilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EventFilterController {
    private final EventFilterService eventFilterService;

    @PostMapping("/events/filter")
    public ResponseEntity<List<EventRankingDto>> filterEvents(@RequestBody EventFilterDto filterDto) {
        List<EventRankingDto> filteredEvents = eventFilterService.filterEvents(filterDto);
        return ResponseEntity.ok(filteredEvents);
    }

    @GetMapping("/events/search")
    public ResponseEntity<List<EventRankingDto>> searchEvents(@RequestParam(required = false) String term) {
        List<EventRankingDto> searchResults = eventFilterService.searchEvents(term);
        return ResponseEntity.ok(searchResults);
    }
}