package com.event_management.event_management_system_backend.controller;

import com.event_management.event_management_system_backend.Dto.*;
import com.event_management.event_management_system_backend.config.UserAuthenticationProvider;
import com.event_management.event_management_system_backend.mapper.AttendeeMapper;
import com.event_management.event_management_system_backend.mapper.EventMapper;
import com.event_management.event_management_system_backend.model.Attendee;
import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.model.EventRating;
import com.event_management.event_management_system_backend.repositories.AdminRepository;
import com.event_management.event_management_system_backend.repositories.AttendeeRepository;
import com.event_management.event_management_system_backend.repositories.EventRatingRepository;
import com.event_management.event_management_system_backend.repositories.EventRepository;
import com.event_management.event_management_system_backend.services.AdminService;
import com.event_management.event_management_system_backend.services.EventRankingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import com.event_management.event_management_system_backend.services.EventRatingService;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Date;

@RequiredArgsConstructor
@RestController
public class AuthController {
    private final AdminService adminService;
    private final UserAuthenticationProvider userAuthenticationProvider;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final AttendeeMapper attendeeMapper;
    private final AttendeeRepository attendeeRepository;
    private final EventRatingRepository eventRatingRepository;
    private final AdminRepository adminRepository;
    private final EventRatingService ratingService;
    private final EventRankingService rankingService;

    @PostMapping("/login")
    public ResponseEntity<AdminDto> login(@RequestBody @Valid CredentialsDto credentialsDto){
        AdminDto adminDto = adminService.login(credentialsDto);
        adminDto.setToken(userAuthenticationProvider.createToken(adminDto.getUsername()));
        return  ResponseEntity.ok(adminDto);
    }

    @PostMapping("/register")
    public ResponseEntity<AdminDto> register(@RequestBody @Valid SignUpDto signUpDto){
        System.out.println(signUpDto);

        AdminDto newAdmin = adminService.register(signUpDto);
        newAdmin.setToken(userAuthenticationProvider.createToken(newAdmin.getUsername()));
        return ResponseEntity.created(URI.create("/admins/" + newAdmin.getId())).body(newAdmin);
    }

    @PostMapping("/addevent")
public ResponseEntity<EventDto> addEvent(@RequestBody @Valid EventDto eventDto){
    System.out.println("the event     "+eventDto);

    // Get the authenticated user's username
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    // Manually create a new Event instance and assign values
    Event newEvent = new Event();
    newEvent.setUsername(eventDto.getUsername()); // Set the username of the logged-in user
    newEvent.setName(eventDto.getName());
    newEvent.setCity(eventDto.getCity());
    newEvent.setCountry(eventDto.getCountry());
    newEvent.setPlace(eventDto.getPlace());
    newEvent.setDescription(eventDto.getDescription());
    newEvent.setDate(eventDto.getDate());
    eventDto.setRating(0);
    newEvent.setRating(0.0);
    newEvent.setCapacity(eventDto.getCapacity());
    //newEvent.setRating(eventDto.getRating()); // Assuming you are storing the rating as averageRating in the Event entity
    newEvent.setCategory(eventDto.getCategory());

    System.out.println("new events username: " + newEvent.getUsername());
    System.out.println("new events rating: " + newEvent.getRating());
    System.out.println("new events capacity: " + newEvent.getCapacity());
    System.out.println("new events aaa: " + eventDto.getCapacity());

    // Save the event to the repository
    Event savedEvent = eventRepository.save(newEvent);
    System.out.println("saved events date: " + savedEvent.getDate());
   
    // Return the saved event details in response
    return ResponseEntity.ok(eventDto);
}


    @GetMapping("/getevent")
    public ResponseEntity<List<EventDto>> getEvents(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AdminDto adminDto = (AdminDto) authentication.getPrincipal();
        String username = adminDto.getUsername();
        //String username = authentication.getName();
        System.out.println("in get events "+ username);

        List<Event> events = eventRepository.findByUsername(username);
        if(!events.isEmpty()) {
            System.out.println(events.get(0).getDate());
        }
        List<EventDto> eventDtoList = eventMapper.listEventToDto(events);
        if(!events.isEmpty()) {
            System.out.println(eventDtoList.get(0).getDate());
        }
        return ResponseEntity.ok(eventDtoList);
    }

    @GetMapping("/events/time-category/{timeCategory}")
    public ResponseEntity<List<EventDto>> getEventsByTimeCategory(@PathVariable String timeCategory) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AdminDto adminDto = (AdminDto) authentication.getPrincipal();
        String username = adminDto.getUsername();

        System.out.println("Fetching " + timeCategory + " events for user: " + username);

        List<Event> events = eventRepository.findByUsernameAndTimeCategory(username, timeCategory);
        List<EventDto> eventDtoList = eventMapper.listEventToDto(events);

        return ResponseEntity.ok(eventDtoList);
    }

    @GetMapping("/registered-events/time-category/{timeCategory}")
    public ResponseEntity<List<EventDto>> getRegisteredEventsByTimeCategory(
            @RequestParam String email,
            @PathVariable String timeCategory) {
        System.out.println("Getting " + timeCategory + " registered events for email: " + email);

        List<Event> events = eventRepository.findRegisteredEventsByEmailAndTimeCategory(email, timeCategory);
        System.out.println("Found " + events.size() + " " + timeCategory + " events for this email");

        List<EventDto> eventDtos = eventMapper.listEventToDto(events);

        return ResponseEntity.ok(eventDtos);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id){
        if(eventRepository.existsById(id)){
            eventRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        else return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id, @RequestBody EventDto updatedEventDto){
        System.out.println("Updated event: " + updatedEventDto + " prev id: " + id);
        return eventRepository.findById(id)
                .map(
                        event -> {
                            event.setName( updatedEventDto.getName());
                            event.setCity(updatedEventDto.getCity());
                            event.setCountry(updatedEventDto.getCountry());
                            event.setPlace(updatedEventDto.getPlace());
                            event.setDescription(updatedEventDto.getDescription());
                            event.setDate(updatedEventDto.getDate());
                            event.setCategory(updatedEventDto.getCategory());

                            Event savedEvent = eventRepository.save(event);
                            return ResponseEntity.ok(eventMapper.eventToEventDto(savedEvent));
                        }
                )
                .orElseGet(()-> ResponseEntity.notFound().build());
    }

    @GetMapping("/getallevents")
    public ResponseEntity<List<EventDto>> getAllEvents(){

        List<Event> events = eventRepository.findAll();
        if(!events.isEmpty()) {
            System.out.println(events.get(0).getDate());
        }
        List<EventDto> eventDtoList = eventMapper.listEventToDto(events);
        if(!events.isEmpty()) {
            System.out.println(eventDtoList.get(0).getDate());
        }
        return ResponseEntity.ok(eventDtoList);
    }

    @PostMapping("/addattendee")
    public ResponseEntity<Attendee> addAttendee(@RequestBody @Valid Attendee attendee){
        System.out.println(attendee.getEventid());


        Attendee savedAttendee = attendeeRepository.save(attendee);
        System.out.println("saved attendee: " + savedAttendee.getEventid());
        return ResponseEntity.ok(savedAttendee);
    }

    @DeleteMapping("/unregister")
    public ResponseEntity<?> unregisterFromEvent(@RequestParam Long eventId, @RequestParam String email) {
        System.out.println("Attempting to unregister email: " + email + " from event ID: " + eventId);

        Optional<Attendee> attendeeOptional = attendeeRepository.findByEventidAndEmail(eventId, email);

        if (attendeeOptional.isPresent()) {
            attendeeRepository.delete(attendeeOptional.get());
            System.out.println("Successfully unregistered");
            return ResponseEntity.ok("Successfully unregistered from event");
        } else {
            System.out.println("Attendee not found");
            return ResponseEntity.badRequest().body("User was not registered to this event");
        }
    }


    @GetMapping("/attendees/{id}")
    public ResponseEntity<List<Attendee>> getAllAttendees(@PathVariable Long id){

        List<Attendee> attendees = attendeeRepository.findByEventid(id);
        if(!attendees.isEmpty()) {
            System.out.println(attendees.get(0).getEventid());
        }
        return ResponseEntity.ok(attendees);
    }

@PostMapping("/events/rate")
public ResponseEntity<?> updateEventRating(@RequestBody EventDto ratingRequest) {
    System.out.println("Received rating update request for event ID: " + ratingRequest.getId() + " with rating: " + ratingRequest.getRating());

    if (ratingRequest.getRating() < 0 || ratingRequest.getRating() > 5) {
        return ResponseEntity.badRequest().body("Rating must be between 0 and 5.");
    }

    Long eventId = ratingRequest.getId();
    Optional<Event> optionalEvent = eventRepository.findById(eventId);
    if (!optionalEvent.isPresent()) {
        return ResponseEntity.notFound().build();
    }

    Event event = optionalEvent.get();

    // Check if user has already rated (assuming ratingRequest contains userId)
    Optional<EventRating> existingRating = eventRatingRepository.findByEventIdAndUserId(eventId, ratingRequest.getUserId());
    if (existingRating.isPresent()) {
        // Update existing rating
        EventRating rating = existingRating.get();
        rating.setRating(ratingRequest.getRating());
        eventRatingRepository.save(rating);
    } else {
        // Save new rating
        EventRating newRating = new EventRating();
        newRating.setEvent(event);
        newRating.setUser(adminRepository.findById(ratingRequest.getUserId()).orElse(null)); // Fetch user
        newRating.setRating(ratingRequest.getRating());
        eventRatingRepository.save(newRating);
    }

    // Recalculate average rating
    double averageRating = eventRatingRepository.calculateAverageRating(eventId);
    event.setRating(averageRating);
    eventRepository.save(event);
    event.setTotal_ratings(event.getTotal_ratings() + 1);
    eventRepository.save(event);

    return ResponseEntity.ok("Rating updated successfully. New average rating: " + averageRating);
}

    @PutMapping("/events/{id}/capacity")
    public ResponseEntity<?> updateEventCapacity(@PathVariable Long id, @RequestParam int capacity) {
        adminService.updateEventCapacity(id, capacity);
        return ResponseEntity.ok("Event capacity updated successfully");
    }

    @GetMapping("/count/{eventId}")
    public ResponseEntity<Long> getTotalRatings(@PathVariable Long eventId) {
        Long totalCount = ratingService.getTotalCountOfRatings(eventId);
        return ResponseEntity.ok(totalCount);
    }

    @GetMapping("/events/ranked/ratings")
    public ResponseEntity<List<EventRankingDto>> getEventsRankedByRating() {
        return ResponseEntity.ok(rankingService.getEventsRankedByRating());
    }

    @GetMapping("/events/ranked/attendees")
    public ResponseEntity<List<EventRankingDto>> getEventsRankedByAttendeeCount() {
        return ResponseEntity.ok(rankingService.getEventsRankedByAttendeeCount());
    }

    @GetMapping("/events/ranked/capacity")
    public ResponseEntity<List<EventRankingDto>> getEventsRankedByCapacity() {
        return ResponseEntity.ok(rankingService.getEventsRankedByCapacity());
    }

    @GetMapping("/events/ranked/available-capacity")
    public ResponseEntity<List<EventRankingDto>> getEventsRankedByAvailableCapacity() {
        return ResponseEntity.ok(rankingService.getEventsRankedByAvailableCapacity());
    }

    @GetMapping("/events/ranked/all")
    public ResponseEntity<List<EventRankingDto>> getEventsWithAllRankings() {
        return ResponseEntity.ok(rankingService.getEventsWithAllRankings());
    }

    @GetMapping("/registered-events")
    public ResponseEntity<List<EventDto>> getRegisteredEvents(@RequestParam String email) {
        System.out.println("Getting registered events for email: " + email);
        
        // Find all attendees with the given email
        List<Attendee> attendees = attendeeRepository.findByEmail(email);
        System.out.println("Found " + attendees.size() + " attendee records for email: " + email);
        
        // Extract the event IDs
        List<Long> eventIds = attendees.stream()
                .map(Attendee::getEventid)
                .collect(Collectors.toList());
        System.out.println("Event IDs: " + eventIds);
        
        // Find all events with those IDs
        List<Event> events = eventRepository.findAllById(eventIds);
        System.out.println("Found " + events.size() + " events for these IDs");
        
        // Convert to DTOs
        List<EventDto> eventDtos = eventMapper.listEventToDto(events);
        
        return ResponseEntity.ok(eventDtos);
    }

    @GetMapping("/events/{eventId}/user-rating")
    public ResponseEntity<Double> getUserRatingForEvent(@PathVariable Long eventId, @RequestParam Long userId) {
        System.out.println("Getting user rating for event ID: " + eventId + " and user ID: " + userId);
        
        Optional<EventRating> userRating = eventRatingRepository.findByEventIdAndUserId(eventId, userId);
        
        if (userRating.isPresent()) {
            System.out.println("Found rating: " + userRating.get().getRating());
            return ResponseEntity.ok(userRating.get().getRating());
        } else {
            System.out.println("No rating found for this user and event");
            return ResponseEntity.ok(0.0); // Return 0 if no rating exists
        }
    }
}
