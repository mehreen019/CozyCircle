package com.event_management.event_management_system_backend.repositories;

import com.event_management.event_management_system_backend.model.Attendee;
import com.event_management.event_management_system_backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
    List<Attendee> findByEventid(Long eventid);
    List<Attendee> findByEmail(String email);

    Optional<Attendee> findByEventidAndEmail(Long eventid, String email);

    @Query("SELECT COALESCE(MAX(a.id), 0) FROM Attendee a")
    Long findMaxId();

    @Transactional
    @Procedure(procedureName = "CalculateMembership")
    void calculateMembership(@Param("mapping_id") Integer mappingId, @Param("p_user_id") Integer userId, @Param("p_event_id") Integer eventId);
}
