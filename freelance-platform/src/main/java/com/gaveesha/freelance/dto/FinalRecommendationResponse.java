package com.gaveesha.freelance.dto;

public class FinalRecommendationResponse {
    private String id;
    private String name;
    private String skills;
    private double matchPercentage;

    public FinalRecommendationResponse( String id, String name, String skills, double matchPercentage){
        this.id=id;
        this.name=name;
        this.skills = skills;
        this.matchPercentage=matchPercentage;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSkills() {
        return skills;
    }

    public double getMatchPercentage() {
        return matchPercentage;
    }
}
