package com.gaveesha.freelance.dto;

public class FreelancerDTO {

    private String id;
    private String skills;

    public FreelancerDTO() {}

    public FreelancerDTO(String id, String skills) {
        this.id = id;
        this.skills = skills;
    }

    public String getId() {
        return id;
    }

    public String getSkills() {
        return skills;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }
}