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

// Skeleton card shown while loading
function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-row">
                <div className="skeleton-avatar" />
                <div className="skeleton-lines">
                    <div className="skeleton-line skeleton-line--medium" />
                    <div className="skeleton-line skeleton-line--short" />
                    <div className="skeleton-line skeleton-line--long" />
                </div>
            </div>
        </div>
    );
}

function RecommendationPage() {

    const [jobDescription, setJobDescription] = useState("");
    const [results, setResults] = useState([]);

    //  loading state
    const [loading, setLoading] = useState(false);

    // error state
    const [error, setError] = useState("");

    const API_URL = "http://localhost:8080/api/recommendations";

    const findFreelancers = () => {

        // clear old error
        setError("");

        // start loading
        setLoading(true);

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobDescription: jobDescription }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch recommendations");
                }
                return res.json();
            })
            .then((data) => {
                setResults(data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
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
                    placeholder="e.g. We are looking for a Senior React Developer..."
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
                        disabled={loading}
                    >
                        {/* Icon: target when idle, mini spinner when loading */}
                        {loading ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.75s linear infinite" }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                            </svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10"/>
                                <circle cx="12" cy="12" r="6"/>
                                <circle cx="12" cy="12" r="2"/>
                            </svg>
                        )}
                        {loading ? "Finding..." : "Find Best Matches"}
                    </button>
                </div>

                {/* Error UI */}
                {error && (
                    <div className="recommendation-error">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {error}
                    </div>
                )}
            </div>

            {/* ── Loading Spinner + Skeleton ── */}
            {loading && (
                <>
                    <div className="recommendation-loading">
                        {/* Double-ring spinner */}
                        <div className="recommendation-loading__spinner" />
                        <p className="recommendation-loading__text">Matching talent to your requirements…</p>
                        {/* Bouncing dots */}
                        <div className="recommendation-loading__dots">
                            <span className="recommendation-loading__dot" />
                            <span className="recommendation-loading__dot" />
                            <span className="recommendation-loading__dot" />
                        </div>
                    </div>

                    {/* Skeleton placeholder cards */}
                    <div className="recommendation-skeleton">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </>
            )}

            {/* ── Results Section ── */}
            {results.length > 0 && !loading && (

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

                                        <div className="result-card__info">
                                            <div className="result-card__name-row">
                                                <div>
                                                    <p className="result-card__name">{r.name}</p>
                                                    <p className="result-card__role">{r.skills}</p>
                                                </div>

                                                {/* Match badge + animated bar */}
                                                <div className="result-card__match-badge">
                                                    <span className="result-card__match-label">
                                                        {r.matchPercentage}% MATCH
                                                    </span>
                                                    <div className="result-card__match-bar-track">
                                                        <div
                                                            className="result-card__match-bar-fill"
                                                            style={{ "--target-width": `${r.matchPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status dot + skill tags */}
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
                                                {/* RIGHT SIDE */}
                                                <button className="freelancer-mini-card__hire">
                                                    Hire Now
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <footer className="recommendation-footer">
                © 2024 FreelanceAI. Matching you with brilliance.
            </footer>

        </div>
    );
}

export default RecommendationPage;