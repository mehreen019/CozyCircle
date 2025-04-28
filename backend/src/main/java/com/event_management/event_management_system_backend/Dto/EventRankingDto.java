package com.event_management.event_management_system_backend.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventRankingDto {
    // Event properties
    private Long id;
    private String username;
    private String name;
    private String city;
    private String country;
    private String place;
    private String description;
    private Date date;
    private double averageRating;
    private int capacity;
    private int total_ratings;
    
    // Ranking and count properties
    private Integer attendeeCount;
    private Integer availableCapacity;
    private Integer ratingRank;
    private Integer attendeeRank;
    private Integer capacityRank;
    private Integer availableCapacityRank;
} 