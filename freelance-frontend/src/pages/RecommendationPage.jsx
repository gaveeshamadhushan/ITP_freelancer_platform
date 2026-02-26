import { useState } from "react";
import "./RecommendationPage.css";

// Helper: initials from name
function getInitials(name = "") {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// Helper: status dot class based on match %
function getStatusDotClass(matchPercentage) {
    if (matchPercentage >= 90) return "status-dot--green";
    if (matchPercentage >= 75) return "status-dot--yellow";
    return "status-dot--red";
}

// Helper: parse skills string into array
function parseSkills(skills = "") {
    return skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function RecommendationPage() {
    const [jobDescription, setJobDescription] = useState("");
    const [results, setResults] = useState([]);

    const API_URL = "http://localhost:8080/api/recommendations";

    const findFreelancers = () => {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobDescription: jobDescription }),
        })
            .then((res) => res.json())
            .then((data) => setResults(data));
    };

    return (
        <div className="recommendation-page">
            {/* ── Page Header ── */}
            <div className="recommendation-page__header">
                <h2 className="recommendation-page__title">Find Freelancers</h2>
                <p className="recommendation-page__subtitle">
                    Our AI-driven engine matches your project requirements with the
                    top 1% of specialized talent instantly.
                </p>
            </div>

            {/* ── Search Card ── */}
            <div className="recommendation-search-card">
                <div className="recommendation-search-card__heading">
                    {/* Document icon */}
                    <div className="recommendation-search-card__icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <line x1="10" y1="9" x2="8" y2="9"/>
                        </svg>
                    </div>
                    <div className="recommendation-search-card__heading-text">
                        <h3>Project Requirements</h3>
                        <p>Be specific about the tech stack, duration, and core responsibilities for better accuracy.</p>
                    </div>
                </div>

                <textarea
                    className="recommendation-search-card__textarea"
                    rows="4"
                    placeholder="e.g. We are looking for a Senior React Developer with experience in TypeScript and Tailwind CSS to build a modern dashboard for a fintech application. Must have experience with real-time data visualization..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />

                <div className="recommendation-search-card__footer">
                    <span className="recommendation-search-card__powered">
                        Analysis powered by GPT-4 Turbo
                    </span>
                    <button
                        className="recommendation-search-card__submit"
                        onClick={findFreelancers}
                    >
                        {/* Trophy/target icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="6"/>
                            <circle cx="12" cy="12" r="2"/>
                        </svg>
                        Find Best Matches
                    </button>
                </div>
            </div>

            {/* ── Results Section ── */}
            {results.length > 0 && (
                <div className="recommendation-results">
                    <div className="recommendation-results__header">
                        <div className="recommendation-results__title-group">
                            <h3 className="recommendation-results__title">Recommended Profiles</h3>
                            <span className="recommendation-results__badge">
                                {results.length} Match{results.length !== 1 ? "es" : ""}
                            </span>
                        </div>
                        <div className="recommendation-results__sort">
                            Sort by: <strong>Match % ∨</strong>
                        </div>
                    </div>

                    <ul className="result-list">
                        {results.map((r, index) => {
                            const skillList = parseSkills(r.skills);
                            const visibleSkills = skillList.slice(0, 4);
                            const extraCount = skillList.length - visibleSkills.length;

                            return (
                                <li key={index} className="result-card">
                                    <div className="result-card__top">
                                        {/* Avatar */}
                                        <div className="result-card__avatar">
                                            {getInitials(r.name)}
                                        </div>

                                        {/* Info */}
                                        <div className="result-card__info">
                                            <div className="result-card__name-row">
                                                <div>
                                                    <p className="result-card__name">{r.name}</p>
                                                    <p className="result-card__role">{r.skills}</p>
                                                </div>

                                                {/* Match badge */}
                                                <div className="result-card__match-badge">
                                                    <span className="result-card__match-label">
                                                        {r.matchPercentage}% MATCH
                                                    </span>
                                                    <div className="result-card__match-bar-track">
                                                        <div
                                                            className="result-card__match-bar-fill"
                                                            style={{ width: `${r.matchPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description placeholder */}
                                            {r.description && (
                                                <p className="result-card__description">{r.description}</p>
                                            )}

                                            {/* Skills + status dot */}
                                            <div className="result-card__bottom">
                                                <span className={`result-card__status-dot ${getStatusDotClass(r.matchPercentage)}`} />
                                                <div className="result-card__skills">
                                                    {visibleSkills.map((skill, i) => (
                                                        <span key={i} className="result-card__skill-tag">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {extraCount > 0 && (
                                                        <span className="result-card__skill-tag result-card__skill-tag--more">
                                                            +{extraCount} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Load more */}
                    <div className="recommendation-load-more">
                        <button className="recommendation-load-more__btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10"/>
                                <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                            </svg>
                            Load more recommendations
                        </button>
                    </div>
                </div>
            )}

            {/* ── Footer ── */}
            <footer className="recommendation-footer">
                © 2024 FreelanceAI. Matching you with brilliance.
            </footer>
        </div>
    );
}

export default RecommendationPage;