package com.gaveesha.freelance.controller;


import com.gaveesha.freelance.dto.ContractRequest;
import com.gaveesha.freelance.model.Contract;
import com.gaveesha.freelance.repository.ContractRepository;
import com.gaveesha.freelance.service.ContractService;
import org.springframework.web.bind.annotation.*;

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
}
