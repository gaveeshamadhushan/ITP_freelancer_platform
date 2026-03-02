package com.gaveesha.freelance.dto;

public class FreelancerResponse {

    private String id;
    private String name;
    private String skills;
    private Double matchPercentage;

    public FreelancerResponse(String id, String name,
                              String skills, Double matchPercentage) {
        this.id = id;
        this.name = name;
        this.skills = skills;
        this.matchPercentage = matchPercentage;
    }

    // getters

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSkills() {
        return skills;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }
}
