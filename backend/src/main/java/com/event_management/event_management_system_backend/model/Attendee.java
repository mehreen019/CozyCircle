package com.event_management.event_management_system_backend.model;

import jakarta.persistence.*;

@Entity
public class Attendee {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "attendee_seq")
    @SequenceGenerator(name = "attendee_seq", sequenceName = "attendee_seq", allocationSize = 1)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "eventid", nullable = false)
    private Long eventid;
    
    @Column(name = "membership")
    private String membership;

    public Attendee() {
    }

    public Attendee(Long id, String name, String email, Long eventid) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.eventid = eventid;
    }

    public Attendee(Long id, String name, String email, Long eventid, String membership) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.eventid = eventid;
        this.membership = membership;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventid() {
        return eventid;
    }

    public void setEventid(Long eventid) {
        this.eventid = eventid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMembership() {
        return membership;
    }
    
    public void setMembership(String membership) {
        this.membership = membership;
    }
}
