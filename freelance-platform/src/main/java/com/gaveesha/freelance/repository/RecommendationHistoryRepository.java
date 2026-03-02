package com.gaveesha.freelance.repository;

import com.gaveesha.freelance.model.RecommendationHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecommendationHistoryRepository
        extends MongoRepository<RecommendationHistory, String> {
}