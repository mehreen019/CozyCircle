package com.event_management.event_management_system_backend.repositories;

import com.event_management.event_management_system_backend.model.Attendee;
import com.event_management.event_management_system_backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
    List<Attendee> findByEventid(Long eventid);
    List<Attendee> findByEmail(String email);

    Optional<Attendee> findByEventidAndEmail(Long eventid, String email);

}
