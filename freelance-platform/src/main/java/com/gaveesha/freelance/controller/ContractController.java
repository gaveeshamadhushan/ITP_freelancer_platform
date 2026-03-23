package com.gaveesha.freelance.controller;


import com.gaveesha.freelance.dto.ContractRequest;
import com.gaveesha.freelance.model.Contract;
import com.gaveesha.freelance.repository.ContractRepository;
import com.gaveesha.freelance.service.ContractService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin("*")
public class ContractController {

    private final ContractService contractService;

    public ContractController( ContractService contractService){
        this.contractService = contractService;
    }

    @PostMapping
    public Contract createContract(@RequestBody ContractRequest request){
        return contractService.creatContract(request);
    }

    // ✅ GET ALL CONTRACTS
    @GetMapping
    public List<Contract> getAllContracts() {
        return contractService.getAllContracts();
    }

    // ✅ GET CONTRACT BY ID
    @GetMapping("/{id}")
    public Contract getContractById(@PathVariable String id) {
        return contractService.getContractById(id);
    }

    // ✅ GET CONTRACTS BY FREELANCER
    @GetMapping("/freelancer/{freelancerId}")
    public List<Contract> getContractsByFreelancer(@PathVariable String freelancerId) {
        return contractService.getContractsByFreelancer(freelancerId);
    }

    // ✅ GET CONTRACTS BY STATUS
    @GetMapping("/status/{status}")
    public List<Contract> getContractsByStatus(@PathVariable String status) {
        return contractService.getContractsByStatus(status);
    }

    // ✅ UPDATE CONTRACT STATUS (VERY IMPORTANT)
    @PutMapping("/{id}/status")
    public Contract updateStatus(@PathVariable String id,
                                 @RequestParam String status) {
        return contractService.updateContractStatus(id, status);
    }
}
