package com.gaveesha.freelance.dto;

import com.gaveesha.freelance.model.RecommendationHistory;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class RecommendationAnalyticsDTO {
    private int totalRecommendations;
    private double averageMatchScore;
    private List<TopFreelancerDTO> topFreelancers;

    public int getTotalRecommendations() {
        return totalRecommendations;
    }

    public void setTotalRecommendations(int totalRecommendations) {
        this.totalRecommendations = totalRecommendations;
    }

    public double getAverageMatchScore() {
        return averageMatchScore;
    }

    public void setAverageMatchScore(double averageMatchScore) {
        this.averageMatchScore = averageMatchScore;
    }

    public List<TopFreelancerDTO> getTopFreelancers() {
        return topFreelancers;
    }

    public void setTopFreelancers(List<TopFreelancerDTO> topFreelancers) {
        this.topFreelancers = topFreelancers;
    }


}
