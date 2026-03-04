# ITP_freelancer_platform
--AI Freelance Hiring System--

Smart AI-driven talent matching platform built with Spring Boot, React, and MongoDB.

An intelligent freelance recommendation platform that analyzes job descriptions and matches them with the most suitable freelancers using a custom AI-based match scoring system.

This project demonstrates full-stack development, REST API design, database integration, and modern UI/UX implementation.

-- Overview --
The AI Freelance Hiring System allows users to:
Enter a job description

- Get AI-powered freelancer recommendations
- View match percentages with animated progress bars
- Automatically save search history
- Review previous searches
- Delete history records
- Re-hire previously recommended freelancers

--- System Architecture---
- React (Frontend - Vite)
        ↓
- Spring Boot REST API
        ↓
- MongoDB Database

Frontend communicates with backend via REST APIs

Backend processes logic and stores data in MongoDB

Recommendation results are saved for historical tracking

--- Tech Stack ---
- Frontend
- React (Vite)
- JavaScript (ES6+)
- CSS (Custom styling)
- Fetch API

--- Backend ---
- Spring Boot 4
- Spring Data MongoDB
- RESTful API Architecture
- Java 22
- Maven

--- Database ---
- MongoDB

Core Features
1️⃣ AI-Based Freelancer Matching
- Accepts job description input
- Compares with freelancer skills
- Calculates match percentage
- Sorts by highest match
- Displays top AI recommendations

2️⃣ Recommendation History
- Each AI search stores:
- Job description
- Search date
- Top recommended freelancers
- Match percentages
- Displayed in a modern card-based UI.

3️⃣ Top AI Recommendation UI
- Each history card includes:
- Freelancer initials avatar
- Freelancer name
- Skills summary
- Match percentage badge
- Animated match progress bar
- Hire button

# 📂 Project Structure
Backend (Spring Boot)

freelance-platform/
 ├── controller/
 │     ├── RecommendationController.java
 │     └── HistoryController.java
 │
 ├── service/
 │     └── RecommendationService.java
 │
 ├── repository/
 │     ├── FreelancerRepository.java
 │     └── RecommendationHistoryRepository.java
 │
 ├── model/
 │     ├── Freelancer.java
 │     ├── RecommendationHistory.java
 │     └── RecommendationResult.java
 │
 └── FreelancePlatformApplication.java

--- Frontend (React + Vite) ----
 freelance-frontend/
 ├── src/
 │    ├── pages/
 │    │     └── HistoryPage.jsx
 │    ├── components/
 │    ├── App.jsx
 │    └── main.jsx
 │
 ├── package.json
 └── vite.config.js

 
