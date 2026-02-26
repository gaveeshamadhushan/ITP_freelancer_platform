package com.gaveesha.freelance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "freelancers")
public class Freelancer {

    @Id
    private String id;

    private String name;
    private String skills;

    public Freelancer(){}

    public Freelancer( String name, String skills){
        this.name = name;
        this.skills = skills;
    }

    public String getId(){
        return id;
    }

    public String getName(){
        return name;
    }

    public String getSkills(){
        return skills;
    }

    public void setId(String id){
        this.id=id;
    }
    public void setName(String name){
        this.name=name;
    }
    public void setSkills(String skills){
        this.skills=skills;
    }
}
