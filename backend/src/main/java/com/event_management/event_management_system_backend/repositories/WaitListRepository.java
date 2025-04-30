package com.event_management.event_management_system_backend.repositories;

import com.event_management.event_management_system_backend.model.WaitList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WaitListRepository extends JpaRepository<WaitList, Long>  {

        // Find all waitlisted users for a specific event
        List<WaitList> findByEventidOrderByPositionAsc(Long eventid);

        // Find a specific waitlisted user by event and email
        Optional<WaitList> findByEventidAndEmail(Long eventid, String email);

        // Count waitlisted users for a specific event
        long countByEventid(Long eventid);

        // Delete all waitlist entries for a specific event and email
        @Transactional
        void deleteByEventidAndEmail(Long eventid, String email);

        // Update positions after someone is removed from the waitlist
        @Modifying
        @Transactional
        @Query("UPDATE WaitList w SET w.position = w.position - 1 WHERE w.eventid = :eventid AND w.position > :position")
        void decrementPositionsAfter(@Param("eventid") Long eventid, @Param("position") Integer position);

        Optional<WaitList> findFirstByEventidOrderByPositionAsc(Long eventId);
        List<WaitList> findByEventidAndPositionGreaterThanOrderByPositionAsc(Long eventId, int position);

}
