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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import java.net.URI;
import java.util.List;

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

    return ResponseEntity.ok("Rating updated successfully. New average rating: " + averageRating);
}

    @PutMapping("/events/{id}/capacity")
    public ResponseEntity<?> updateEventCapacity(@PathVariable Long id, @RequestParam int capacity) {
        adminService.updateEventCapacity(id, capacity);
        return ResponseEntity.ok("Event capacity updated successfully");
    }
}
