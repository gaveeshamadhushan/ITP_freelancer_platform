from app.recommender import recommend_freelancers

job_description = "Looking for a React developer with Spring Boot and REST API experience"

freelancers = [
    {"id": 1, "skills": "React Node.js MongoDB"},
    {"id": 2, "skills": "Spring Boot REST API MySQL"},
    {"id": 3, "skills": "Graphic Design Photoshop Illustrator"}
]

results = recommend_freelancers(job_description, freelancers)

for r in results:
    print(f"Freelancer {r['freelancer_id']} - Match: {r['match_percentage']}%")