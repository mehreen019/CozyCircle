package com.event_management.event_management_system_backend.repositories;

import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.model.admin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUsername(String username);
     Optional<Event> findById(Long Id);
}

