package com.event_management.event_management_system_backend.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Date;
import javax.persistence.Column;

@Entity
public class Event {
    @Id
    @GeneratedValue()
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;
    private String name;
    private String city;
    private String country;
    private String place;
    private String description;
    private Date date;
    private double averageRating=0.0;
    private int capacity;

    // @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //private List<Attendee> attendees;

    public Event() {
    }

    public Event(Long id, String name, String city, String country, String place, String description, Date date, String username, int capacity) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.country = country;
        this.place = place;
        this.description = description;
        this.date = date;
        this.username = username;
        this.averageRating= 0;
        this.capacity= capacity;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getRating() {
        return averageRating;
    }

    public void setRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
    /*public List<Attendee> getAttendees() {
        return attendees;
    }

    public void setAttendees(List<Attendee> attendees) {
        this.attendees = attendees;
    }*/
    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}
