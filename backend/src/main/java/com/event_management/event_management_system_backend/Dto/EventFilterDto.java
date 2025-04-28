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
public class EventFilterDto {
    private String name;
    private String city;
    private String country;
    private Double minRating;
    private Double maxRating;
    private Date startDate;
    private Date endDate;
    private Integer minCapacity;
    private Integer maxCapacity;
    private Integer minAvailableCapacity;
    private String sortBy;
    private String category;
    private String searchTerm;
}