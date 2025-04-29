package com.event_management.event_management_system_backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class WaitList {

    @Id
    @GeneratedValue()
    private Long id;

    @Column(name = "eventid", nullable = false)
    private Long eventid;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "registration_time", nullable = false)
    private Date registrationTime;

    @Column(name = "position", nullable = false)
    private Integer position;

    public void Waitlist() {
    }

    public void Waitlist(Long eventid, String name, String email, Date registrationTime, Integer position) {
        this.eventid = eventid;
        this.name = name;
        this.email = email;
        this.registrationTime = registrationTime;
        this.position = position;
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
    public Date getRegistrationTime() {
        return registrationTime;
    }
    public void setRegistrationTime(Date registrationTime) {
        this.registrationTime = registrationTime;
    }
    public Integer getPosition() {
        return position;
    }
    public void setPosition(Integer position) {
        this.position = position;
    }
}
