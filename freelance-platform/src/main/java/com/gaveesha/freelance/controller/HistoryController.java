package com.gaveesha.freelance.controller;

import com.gaveesha.freelance.model.RecommendationHistory;
import com.gaveesha.freelance.repository.RecommendationHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin("*")
public class HistoryController {

    private final RecommendationHistoryRepository historyRepository;

    public HistoryController(RecommendationHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @GetMapping
    public List<RecommendationHistory> getAllHistory() {
        return historyRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteHistory(@PathVariable String id) {
        historyRepository.deleteById(id);
    }
}