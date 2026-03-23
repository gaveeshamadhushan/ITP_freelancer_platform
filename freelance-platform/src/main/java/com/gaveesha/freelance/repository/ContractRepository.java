package com.gaveesha.freelance.repository;

import com.gaveesha.freelance.model.Contract;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ContractRepository extends MongoRepository<Contract, String> {

    //get contract by freelancer
    List<Contract> findByFreelanceId(String freelanceId);

    //get contract by status
    List<Contract> findByStatus(String status);

}
