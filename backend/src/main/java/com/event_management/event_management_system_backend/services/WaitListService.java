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
        Optional<WaitList> firstWaitlisted = waitlistRepository.findFirstByEventidOrderByPositionAsc(eventId);

        if (firstWaitlisted.isPresent()) {
            WaitList entry = firstWaitlisted.get();

            // Check if there's capacity
            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (!eventOpt.isPresent()) {
                return false;
            }

            Event event = eventOpt.get();
            long currentAttendees = attendeeRepository.findByEventid(eventId).size();

            if (currentAttendees < event.getCapacity()) {
                // Create a new attendee from the waitlist entry
                Attendee attendee = new Attendee();
                attendee.setEventid(eventId);
                attendee.setName(entry.getName());
                attendee.setEmail(entry.getEmail());
                attendeeRepository.save(attendee);

                // Remove from waitlist
                removeFromWaitlist(eventId, entry.getEmail());

                return true;
            }
        }

        return false;
    }
}