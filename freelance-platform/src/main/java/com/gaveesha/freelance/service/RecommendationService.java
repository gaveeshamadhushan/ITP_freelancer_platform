package com.gaveesha.freelance.service;

import com.gaveesha.freelance.dto.*;
import com.gaveesha.freelance.model.Freelancer;
import com.gaveesha.freelance.repository.FreelancerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class RecommendationService {

    private final RestTemplate restTemplate;
    private final FreelancerRepository freelancerRepository;

    private final String FLASK_URL = "http://localhost:5000/recommend";

    public RecommendationService(RestTemplate restTemplate,
                                 FreelancerRepository freelancerRepository) {
        this.restTemplate = restTemplate;
        this.freelancerRepository = freelancerRepository;
    }

    public List<FinalRecommendationResponse> getRecommendations(String jobDescription) {
        // Get all freelancers from DB
        List<Freelancer> freelancers = freelancerRepository.findAll();

        // Prepare list for Flask
        List<Map<String, Object>> freelancerList = new ArrayList<>();

        for (Freelancer f : freelancers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("skills", f.getSkills());
            freelancerList.add(map);
        }

        //Prepare Flask request
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("job_description", jobDescription);
        requestBody.put("freelancers", freelancerList);

        // Call Flask
        RecommendationResponse[] flaskResults = restTemplate.postForObject(
                FLASK_URL,
                requestBody,
                RecommendationResponse[].class
        );

        // Convert to enriched response
        List<FinalRecommendationResponse> finalResults = new ArrayList<>();

        if (flaskResults != null) {
            for (RecommendationResponse r : flaskResults) {

                Freelancer freelancer = freelancers.stream()
                        .filter(f -> f.getId().equals(r.getFreelancer_id()))
                        .findFirst()
                        .orElse(null);

                if (freelancer != null) {

                    FinalRecommendationResponse response =
                            new FinalRecommendationResponse(
                                    freelancer.getId(),
                                    freelancer.getName(),
                                    freelancer.getSkills(),
                                    r.getMatch_percentage()
                            );

                    finalResults.add(response);
                }
            }
        }

        return finalResults;
    }
}