package com.gaveesha.freelance.repository;

import com.gaveesha.freelance.model.Contract;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContractRepository extends MongoRepository<Contract, String> {

}
