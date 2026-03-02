package com.gaveesha.freelance.dto;

import java.time.LocalDateTime;
import java.util.List;

public class HistoryResponse {

    private Long id;
    private String jobDescription;
    private LocalDateTime createdAt;
    private List<FreelancerResponse> recommendations;

    public HistoryResponse(Long id, String jobDescription,
                           LocalDateTime createdAt,
                           List<FreelancerResponse> recommendations) {
        this.id = id;
        this.jobDescription = jobDescription;
        this.createdAt = createdAt;
        this.recommendations = recommendations;
    }

    // getters

    public Long getId() {
        return id;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<FreelancerResponse> getRecommendations() {
        return recommendations;
    }
}
