package com.gaveesha.freelance.controller;

import com.gaveesha.freelance.model.Freelancer;
import com.gaveesha.freelance.repository.FreelancerRepository;
import org.apache.catalina.LifecycleState;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/freelancers")
@CrossOrigin(origins = "http://localhost:5173") //frontend access
public class FreelancerController {
    private final FreelancerRepository freelancerRepository;

    public FreelancerController(FreelancerRepository freelancerRepository){
        this.freelancerRepository = freelancerRepository;
    }

    //creat freelancer
    @PostMapping
    public Freelancer creatFreelancer(@RequestBody Freelancer freelancer){
        return freelancerRepository.save(freelancer);
    }

    //Read all freelancers
    @GetMapping
    public List<Freelancer> getAllFreelancers(){
        return freelancerRepository.findAll();
    }

    //Read single freelancer
    @GetMapping("/{id}")
    public Optional<Freelancer> getFreelancerById(@PathVariable String id){
        return freelancerRepository.findById(id);
    }

    //Update freelancer
    @PutMapping("/{id}")
    public Freelancer updateFreelancer(@PathVariable String id, @RequestBody Freelancer updateFreelancer ){
        return freelancerRepository.findById(id)
                .map(freelancer -> {
                    freelancer.setName(updateFreelancer.getName());
                    freelancer.setSkills(updateFreelancer.getSkills());
                    return freelancerRepository.save(freelancer);
                })
                .orElseThrow(()-> new RuntimeException("Freelancer not found"));
    }

    //Delete freelancer
    @DeleteMapping("/{id}")
    public String deleteFreelancer(@PathVariable String id){
        freelancerRepository.deleteById(id);
        return "Freelancer deleted successfully";
    }
}
