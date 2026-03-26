package com.gaveesha.freelance.controller;

import com.gaveesha.freelance.dto.*;
import com.gaveesha.freelance.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public List<FinalRecommendationResponse> recommend(@RequestBody RecommendationRequest request) {

        if (request == null) {
            throw new RuntimeException("Request body cannot be empty");
        }

        if (request.getJobDescription() == null ||
                request.getJobDescription().trim().isEmpty()) {

            throw new IllegalArgumentException("Job description is required");
        }

        return recommendationService.getRecommendations(
                request.getJobDescription()
        );
    }
    @GetMapping("/analytics")
    public RecommendationAnalyticsDTO getAnalytics() {
        return recommendationService.getAnalytics();
    }
}