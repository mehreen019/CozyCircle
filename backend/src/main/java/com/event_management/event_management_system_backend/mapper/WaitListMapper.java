package com.event_management.event_management_system_backend.mapper;


import com.event_management.event_management_system_backend.Dto.WaitListDto;
import com.event_management.event_management_system_backend.model.WaitList;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class WaitListMapper {

    public WaitListDto waitlistToWaitListDto(WaitList waitlist) {
        return WaitListDto.builder()
                .id(waitlist.getId())
                .eventid(waitlist.getEventid())
                .name(waitlist.getName())
                .email(waitlist.getEmail())
                .registrationTime(waitlist.getRegistrationTime())
                .position(waitlist.getPosition())
                .build();
    }

    public List<WaitListDto> listWaitListToDto(List<WaitList> waitlists) {
        return waitlists.stream()
                .map(this::waitlistToWaitListDto)
                .collect(Collectors.toList());
    }
}