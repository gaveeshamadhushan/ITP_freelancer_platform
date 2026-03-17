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

}
