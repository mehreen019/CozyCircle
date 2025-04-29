package com.event_management.event_management_system_backend.Dto;

import jakarta.validation.constraints.NotEmpty;

public class AttendeeDto {
    private Long id;

    private String name;
    private String email;
    private Long eventid;
    private String membership;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public Long getEventid() {
        return eventid;
    }
    
    public void setEventid(Long eventid) {
        this.eventid = eventid;
    }
    
    public String getMembership() {
        return membership;
    }
    
    public void setMembership(String membership) {
        this.membership = membership;
    }
}
