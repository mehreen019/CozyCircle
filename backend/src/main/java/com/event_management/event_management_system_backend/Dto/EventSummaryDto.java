package com.event_management.event_management_system_backend.Dto;
public class EventSummaryDto {
    private String category;
    private String place;
    private Long eventCount;

    // Constructors
    public EventSummaryDto(String category, String place, Long eventCount) {
        this.category = category;
        this.place = place;
        this.eventCount = eventCount;
    }

    // Getters and Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public Long getEventCount() { return eventCount; }
    public void setEventCount(Long eventCount) { this.eventCount = eventCount; }
}
