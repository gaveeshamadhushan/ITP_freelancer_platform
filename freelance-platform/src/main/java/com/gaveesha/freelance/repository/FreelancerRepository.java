package com.gaveesha.freelance.repository;

import com.gaveesha.freelance.model.Freelancer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FreelancerRepository extends MongoRepository<Freelancer, String> {
}
