package com.event_management.event_management_system_backend.services;

import com.event_management.event_management_system_backend.model.Attendee;
import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.model.WaitList;
import com.event_management.event_management_system_backend.repositories.AttendeeRepository;
import com.event_management.event_management_system_backend.repositories.EventRepository;
import com.event_management.event_management_system_backend.repositories.WaitListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class WaitListService {

    @Autowired
    private WaitListRepository waitlistRepository;

    @Autowired
    private AttendeeRepository attendeeRepository;

    @Autowired
    private EventRepository eventRepository;

    /**
     * Add a user to the waitlist for an event
     */
    @Transactional
    public WaitList addToWaitlist(Long eventId, String name, String email) {
        // Get the current waitlist count to determine the position
        long currentPosition = waitlistRepository.countByEventid(eventId);

        // Create a new waitlist entry
        WaitList waitlistEntry = new WaitList();
        waitlistEntry.setEventid(eventId);
        waitlistEntry.setName(name);
        waitlistEntry.setEmail(email);
        waitlistEntry.setRegistrationTime(new Date());
        waitlistEntry.setPosition((int) currentPosition + 1);

        return waitlistRepository.save(waitlistEntry);
    }

    /**
     * Get the entire waitlist for an event
     */
    public List<WaitList> getWaitlistForEvent(Long eventId) {
        return waitlistRepository.findByEventidOrderByPositionAsc(eventId);
    }

    /**
     * Check if someone is on the waitlist
     */
    public boolean isOnWaitlist(Long eventId, String email) {
        return waitlistRepository.findByEventidAndEmail(eventId, email).isPresent();
    }

    /**
     * Remove someone from the waitlist
     */
    @Transactional
    public void removeFromWaitlist(Long eventId, String email) {
        Optional<WaitList> waitlistEntry = waitlistRepository.findByEventidAndEmail(eventId, email);

        System.out.println(waitlistEntry.isPresent() + " WAITLIST REMOVE STATUS");

        if (waitlistEntry.isPresent()) {
            Integer position = waitlistEntry.get().getPosition();
            waitlistRepository.deleteByEventidAndEmail(eventId, email);

            // Update positions for everyone after this person
            waitlistRepository.decrementPositionsAfter(eventId, position);
        }
    }

    /**
     * Promote the first person from the waitlist to attendee
     */
    @Transactional
    public boolean promoteFromWaitlist(Long eventId) {
        try {
            // Find the first person on the waitlist
            Optional<WaitList> firstWaitlisted = waitlistRepository.findFirstByEventidOrderByPositionAsc(eventId);

            if (!firstWaitlisted.isPresent()) {
                return false; // No one to promote
            }

            WaitList entry = firstWaitlisted.get();
            String promotedEmail = entry.getEmail();
            String promotedName = entry.getName();
            Integer position = entry.getPosition();

            // Get the max ID from attendee table and increment
            Long maxAttendeeId = attendeeRepository.findMaxId();
            Long newAttendeeId = (maxAttendeeId != null) ? maxAttendeeId + 1 : 1L;

            // Create a new Attendee entity with explicit ID
            Attendee attendee = new Attendee();
            attendee.setId(newAttendeeId);
            attendee.setEventid(eventId);
            attendee.setName(promotedName);
            attendee.setEmail(promotedEmail);

            // Save the attendee with explicit ID
            attendeeRepository.save(attendee);

            // Remove from waitlist - do this manually to ensure atomic operation
            waitlistRepository.deleteByEventidAndEmail(eventId, promotedEmail);

            // Update positions for everyone after this person
            waitlistRepository.decrementPositionsAfter(eventId, position);

            System.out.println("Promoted " + promotedName + " (" + promotedEmail + ") to attendee with ID: " + newAttendeeId);
            return true;
        } catch (Exception e) {
            // Log the error
            System.err.println("Error during waitlist promotion: " + e.getMessage());
            e.printStackTrace();
            // Re-throw to ensure transaction is rolled back
            throw new RuntimeException("Failed to promote user from waitlist", e);
        }
    }


}