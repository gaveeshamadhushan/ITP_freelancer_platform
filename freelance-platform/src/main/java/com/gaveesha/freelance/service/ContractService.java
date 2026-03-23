package com.gaveesha.freelance.service;

import com.gaveesha.freelance.dto.ContractRequest;
import com.gaveesha.freelance.dto.MilestoneDTO;
import com.gaveesha.freelance.model.Contract;
import com.gaveesha.freelance.model.Milestone;
import com.gaveesha.freelance.repository.ContractRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ContractService {

    private final ContractRepository contractRepository;

    public ContractService( ContractRepository contractRepository){
        this.contractRepository = contractRepository;
    }

    public Contract creatContract(ContractRequest request){
        Contract contract = new Contract();

        contract.setFreelanceId(request.freelanceId);
        contract.setFreelancerName(request.freelancerName);
        contract.setSkills(request.skills);
        contract.setMatchPercentage(request.matchPercentage);
        contract.setJobTitle(request.jobTitle);
        contract.setEngagementType(request.engagementType);
        contract.setProjectDescription(request.projectDescription);

        //Convert milestone
        List<Milestone> milestoneList = new ArrayList<>();
        if (request.milestones != null){
            for (MilestoneDTO dto : request.milestones){
                Milestone m = new Milestone();
                m.setTitle(dto.title);
                m.setDescription(dto.description);
                m.setDueDate(dto.dueDate);
                milestoneList.add(m);
            }
        }

        contract.setMilestones(milestoneList);
        contract.setCreatedAt(LocalDateTime.now());

        return contractRepository.save(contract);
    }

    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    public Contract getContractById(String id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
    }

    public List<Contract> getContractsByFreelancer(String freelanceId) {
        return contractRepository.findByFreelanceId(freelanceId);
    }

    public List<Contract> getContractsByStatus(String status) {
        return contractRepository.findByStatus(status);
    }

    public Contract updateContractStatus(String id, String status) {
        return contractRepository.findById(id)
                .map(contract -> {
                    contract.setStatus("PENDING");
                    return contractRepository.save(contract);
                })
                .orElseThrow(() -> new RuntimeException("Contract not found"));
    }
}
