
package com.event_management.event_management_system_backend.Dto;

public class CategoryCountDto {
    private String category;
    private Long count;

    public CategoryCountDto(String category, Long count) {
        this.category = category;
        this.count = count;
    }

    public String getCategory() {
        return category;
    }

    public Long getCount() {
        return count;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}