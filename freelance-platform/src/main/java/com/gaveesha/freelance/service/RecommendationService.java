package com.gaveesha.freelance.service;

import com.gaveesha.freelance.dto.*;
import com.gaveesha.freelance.model.*;
import com.gaveesha.freelance.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final RestTemplate restTemplate;
    private final FreelancerRepository freelancerRepository;
    private final RecommendationHistoryRepository historyRepository;

    private final String FLASK_URL = "http://localhost:5000/recommend";

    public RecommendationService(RestTemplate restTemplate,
                                 FreelancerRepository freelancerRepository,
                                 RecommendationHistoryRepository historyRepository) {
        this.restTemplate = restTemplate;
        this.freelancerRepository = freelancerRepository;
        this.historyRepository = historyRepository;
    }

    public List<FinalRecommendationResponse> getRecommendations(String jobDescription) {

        List<Freelancer> freelancers = freelancerRepository.findAll();

        List<Map<String, Object>> freelancerList = new ArrayList<>();

        for (Freelancer f : freelancers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("skills", f.getSkills());
            freelancerList.add(map);
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("job_description", jobDescription);
        requestBody.put("freelancers", freelancerList);

        RecommendationResponse[] flaskResults = restTemplate.postForObject(
                FLASK_URL,
                requestBody,
                RecommendationResponse[].class
        );

        List<FinalRecommendationResponse> finalResults = new ArrayList<>();
        List<RecommendationResult> historyResults = new ArrayList<>();

        if (flaskResults != null) {
            for (RecommendationResponse r : flaskResults) {

                Freelancer freelancer = freelancers.stream()
                        .filter(f -> f.getId().equals(r.getFreelancer_id()))
                        .findFirst()
                        .orElse(null);

                if (freelancer != null) {

                    // For frontend
                    finalResults.add(
                            new FinalRecommendationResponse(
                                    freelancer.getId(),
                                    freelancer.getName(),
                                    freelancer.getSkills(),
                                    r.getMatch_percentage()
                            )
                    );

                    // For Mongo history
                    RecommendationResult historyResult = new RecommendationResult();
                    historyResult.setFreelancerId(freelancer.getId());
                    historyResult.setName(freelancer.getName());
                    historyResult.setSkills(freelancer.getSkills());
                    historyResult.setMatchPercentage(r.getMatch_percentage());
                    historyResults.sort(
                            (a, b) -> Double.compare(b.getMatchPercentage(), a.getMatchPercentage())
                    );

                    historyResults.add(historyResult);
                }
            }
        }

        // Save history document
        RecommendationHistory history = new RecommendationHistory();
        history.setJobDescription(jobDescription);
        history.setCreatedAt(LocalDateTime.now());
        history.setRecommendations(historyResults);

        historyRepository.save(history);

        return finalResults;
    }
    public RecommendationAnalyticsDTO getAnalytics() {

        List<RecommendationHistory> history = historyRepository.findAll();

        int total = history.size();

        double avgScore = history.stream()
                .flatMap(h -> h.getRecommendations().stream())
                .filter(r -> r.getMatchPercentage() != null)
                .mapToDouble(RecommendationResult::getMatchPercentage)
                .average()
                .orElse(0);

        // Round to 1 decimal place
        avgScore = Math.round(avgScore * 10.0) / 10.0;


        Map<String, Long> grouped = history.stream()
                .filter(h -> h.getFreelancerName() != null)
                .collect(Collectors.groupingBy(
                        RecommendationHistory::getFreelancerName,
                        Collectors.counting()
                ));

        List<TopFreelancerDTO> topList = grouped.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(5)
                .map(e -> {
                    TopFreelancerDTO dto = new TopFreelancerDTO();
                    dto.setName(e.getKey());
                    dto.setCount(e.getValue().intValue());
                    return dto;
                })
                .toList();

        RecommendationAnalyticsDTO dto = new RecommendationAnalyticsDTO();
        dto.setTotalRecommendations(total);
        dto.setAverageMatchScore(avgScore);
        dto.setTopFreelancers(topList);

        return dto;
    }
}