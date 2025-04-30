package com.event_management.event_management_system_backend.controller;

import com.event_management.event_management_system_backend.Dto.EventDto;
import com.event_management.event_management_system_backend.mapper.EventMapper;
import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventArchiveController {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public EventArchiveController(EventRepository eventRepository, EventMapper eventMapper, JdbcTemplate jdbcTemplate) {
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/archive-old")
    public ResponseEntity<Map<String, String>> archiveOldEvents() {
        String result = jdbcTemplate.queryForObject("CALL ArchiveOldEvents()", String.class);
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/archived")
    public ResponseEntity<List<EventDto>> getArchivedEvents() {
        List<Event> archivedEvents = eventRepository.findByArchivedTrue();
        return ResponseEntity.ok(eventMapper.listEventToDto(archivedEvents));
    }

    @GetMapping("/filter-archived")
    public ResponseEntity<?> filterArchivedEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(required = false) Integer minAvailableCapacity,
            @RequestParam(required = false, defaultValue = "rating") String sortBy) {

        return ResponseEntity.ok(eventRepository.findEventsWithFiltersAndArchiveStatus(
                name, city, country, category, minRating, maxRating,
                null, null, minCapacity, maxCapacity,
                minAvailableCapacity, sortBy, true));
    }
}