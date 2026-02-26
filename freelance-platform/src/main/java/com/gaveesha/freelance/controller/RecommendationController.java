package com.gaveesha.freelance.controller;

import com.gaveesha.freelance.dto.*;
import com.gaveesha.freelance.model.Freelancer;
import com.gaveesha.freelance.repository.FreelancerRepository;
import com.gaveesha.freelance.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final FreelancerRepository freelancerRepository;

    public RecommendationController(RecommendationService recommendationService, FreelancerRepository freelancerRepository) {
        this.recommendationService = recommendationService;
        this.freelancerRepository = freelancerRepository;
    }

    @PostMapping
    public List<FinalRecommendationResponse>recommend(@RequestBody RecommendationRequest request) {

        //fetch freelancers from MongoDB
        List<Freelancer> dbFreelancers = freelancerRepository.findAll();

        //Convert DB objects to DTO format required by flask
        List<FreelancerDTO> freelancerDTOS = dbFreelancers.stream()
                .filter(f -> f.getName() != null && f.getSkills() !=null)
                .map(f-> new FreelancerDTO(
                        f.getId(),
                        f.getSkills()
                ))
                .toList();

        //set freelancers inside request
        request.setFreelancers(freelancerDTOS);

        //send to flask
        return recommendationService.getRecommendations(request.getJobDescription());
    }

    @GetMapping("/test-db")
    public List<Freelancer> testDb() {
        return freelancerRepository.findAll();
    }
}