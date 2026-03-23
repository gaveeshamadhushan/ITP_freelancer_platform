package com.gaveesha.freelance.dto;

import com.gaveesha.freelance.model.Milestone;

import java.util.List;

public class ContractRequest {

    public String freelanceId;
    public String freelancerName;
    public String skills;
    public String matchPercentage;
    public String jobTitle;
    public String engagementType;
    public String projectDescription;

    public List<MilestoneDTO>milestones;

    public String getFreelanceId() {
        return freelanceId;
    }

    public void setFreelanceId(String freelanceId) {
        this.freelanceId = freelanceId;
    }

    public String getFreelancerName() {
        return freelancerName;
    }

    public void setFreelancerName(String freelancerName) {
        this.freelancerName = freelancerName;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(String matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getEngagementType() {
        return engagementType;
    }

    public void setEngagementType(String engagementType) {
        this.engagementType = engagementType;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public List<MilestoneDTO> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<MilestoneDTO> milestones) {
        this.milestones = milestones;
    }
}
