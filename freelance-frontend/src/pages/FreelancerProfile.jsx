import { useState, useEffect } from "react";
import "./FreelancerProfile.css";

/* ── Helper ── */
function getInitials(name = "") {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const API_BASE = "http://localhost:8080";

/*
  Expected API response from GET /api/freelancers/:id

  {
    id: string,
    name: string,
    skills: string,          // e.g. "Senior Full-Stack Engineer"
    matchPercentage: number,

    // Optional enriched fields (backend may return these):
    location: string,        // e.g. "San Francisco, CA"
    memberSince: string,     // e.g. "2019"
    hourlyRate: number,      // e.g. 85
    jobsCompleted: number,   // e.g. 124
    jobsGrowth: string,      // e.g. "+12%"
    totalEarned: string,     // e.g. "$200k+"
    rating: number,          // e.g. 4.9
    availability: string,    // e.g. "Available Now"
    responseTime: string,    // e.g. "< 2 hours"
    language: string,        // e.g. "English, Mandarin"
    bio: string,
    bioDetail: string,
    competencies: string[],
    education: [{ degree, school }],
    verifications: string[],
    portfolio: [{ title, description, tags, thumbColor }],
    projects: [{ title, company, period, description, rating }]
  }
*/

/* ────────────────────────────────────
   SUB-COMPONENTS
──────────────────────────────────── */

function PortfolioItem({ item }) {
    return (
        <div className="profile-portfolio__item">
            <div
                className="profile-portfolio__thumb"
                style={item.thumbColor ? { background: item.thumbColor } : {}}
            >
                {item.image
                    ? <img src={item.image} alt={item.title} />
                    : <span>{item.title}</span>
                }
            </div>
            <div className="profile-portfolio__item-info">
                <p className="profile-portfolio__item-title">{item.title}</p>
                <p className="profile-portfolio__item-desc">{item.description}</p>
                <div className="profile-portfolio__item-tags">
                    {(item.tags || []).map((tag, i) => (
                        <span key={i} className="profile-portfolio__item-tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProjectItem({ project }) {
    return (
        <div className="profile-project-item">
            <div className="profile-project-item__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
            </div>
            <div className="profile-project-item__content">
                <div className="profile-project-item__top">
                    <p className="profile-project-item__title">{project.title}</p>
                    {project.rating && (
                        <span className="profile-project-item__rating">
                            {project.rating} Rating
                        </span>
                    )}
                </div>
                <p className="profile-project-item__period">{project.period}</p>
                <p className="profile-project-item__desc">{project.description}</p>
            </div>
        </div>
    );
}

/* ────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────── */
function FreelancerProfile({ freelancer: freelancerProp, freelancerId, onBack, onHire, onViewContracts }) {
    /*
      Props:
        freelancerProp  — basic freelancer obj passed from parent (id, name, skills, matchPercentage)
        freelancerId    — alternative: pass just the id, component fetches full profile
        onBack()        — navigate back
        onHire(f)       — navigate to hire page
    */

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllProjects, setShowAllProjects] = useState(false);

    const id = freelancerProp?.id ?? freelancerId;

    useEffect(() => {
        // If no id at all, just use the prop data directly
        if (!id) {
            setProfile(freelancerProp ?? null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        fetch(`${API_BASE}/api/freelancers/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error(`status ${res.status}`);
                return res.json();
            })
            .then((data) => setProfile(data))
            .catch(() => {
                // API not ready or failed — always fall back to prop data
                if (freelancerProp) {
                    setProfile(freelancerProp);
                } else {
                    setError("Could not load profile. Please try again.");
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    <div className="profile-loading__spinner" />
                    <p className="profile-loading__text">Loading profile…</p>
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                </div>
            </div>
        );
    }

    if (!profile) return null;

    /* ── Derived data with safe fallbacks ── */
    const name           = profile.name ?? "Freelancer";
    const skills         = profile.skills ?? "";
    const matchPct       = profile.matchPercentage ?? 0;
    const location       = profile.location ?? "";
    const memberSince    = profile.memberSince ? `Member since ${profile.memberSince}` : "";
    const hourlyRate     = profile.hourlyRate ?? null;
    const jobsCompleted  = profile.jobsCompleted ?? null;
    const jobsGrowth     = profile.jobsGrowth ?? "";
    const totalEarned    = profile.totalEarned ?? "";
    const rating         = profile.rating ?? null;
    const availability   = profile.availability ?? "";
    const responseTime   = profile.responseTime ?? "";
    const language       = profile.language ?? "";
    const bio            = profile.bio ?? "";
    const bioDetail      = profile.bioDetail ?? "";
    const competencies   = profile.competencies ?? (skills ? skills.split(",").map(s => s.trim()) : []);
    const education      = profile.education ?? [];
    const verifications  = profile.verifications ?? [];
    const portfolio      = profile.portfolio ?? [];
    const projects       = profile.projects ?? [];
    const visibleProjects = showAllProjects ? projects : projects.slice(0, 2);

    return (
        <div className="profile-page">

            {/* ── Hero Banner ── */}
            <div className="profile-hero">
                <div className="profile-hero__inner">

                    {/* Avatar */}
                    <div className="profile-hero__avatar-wrap">
                        <div className="profile-hero__avatar">
                            {getInitials(name)}
                        </div>
                        <span className="profile-hero__online" />
                    </div>

                    {/* Info */}
                    <div className="profile-hero__info">
                        <div className="profile-hero__name-row">
                            <h1 className="profile-hero__name">{name}</h1>
                            {/* Verified badge */}
                            <span className="profile-hero__verified">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563eb">
                                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </span>
                        </div>
                        <p className="profile-hero__role">{skills}</p>
                        <div className="profile-hero__meta">
                            {location && (
                                <span className="profile-hero__meta-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    {location}
                                </span>
                            )}
                            {memberSince && (
                                <span className="profile-hero__meta-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    {memberSince}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Hero action buttons */}
                    <div className="profile-hero__actions">
                        <button
                            className="profile-hero__btn-hire"
                            onClick={() => onHire && onHire(profile)}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                            </svg>
                            Hire Now
                        </button>
                        <button className="profile-hero__btn-save">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                            </svg>
                            Save to Shortlist
                        </button>
                        <button
                            className="profile-hero__btn-contracts"
                            onClick={() => onViewContracts && onViewContracts()}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                            My Contracts
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="profile-body">

                {/* ═══════════ LEFT COLUMN ═══════════ */}
                <div className="profile-left">

                    {/* Stats Row */}
                    {(jobsCompleted || totalEarned || rating) && (
                        <div className="profile-stats">
                            {jobsCompleted != null && (
                                <div className="profile-stat-card">
                                    <p className="profile-stat-card__label">Jobs Completed</p>
                                    <p className="profile-stat-card__value">
                                        {jobsCompleted}
                                        {jobsGrowth && (
                                            <span className="profile-stat-card__badge">{jobsGrowth}</span>
                                        )}
                                    </p>
                                </div>
                            )}
                            {totalEarned && (
                                <div className="profile-stat-card">
                                    <p className="profile-stat-card__label">Total Earned</p>
                                    <p className="profile-stat-card__value">{totalEarned}</p>
                                </div>
                            )}
                            {rating != null && (
                                <div className="profile-stat-card">
                                    <p className="profile-stat-card__label">Rating</p>
                                    <p className="profile-stat-card__value">
                                        {rating}
                                        <span className="profile-stat-card__star">★</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI Match Card */}
                    {matchPct > 0 && (
                        <div className="profile-ai-match">
                            <div className="profile-ai-match__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <circle cx="12" cy="12" r="6"/>
                                    <circle cx="12" cy="12" r="2"/>
                                </svg>
                            </div>
                            <div className="profile-ai-match__text">
                                <p className="profile-ai-match__title">Smart AI Match</p>
                                <p className="profile-ai-match__subtitle">
                                    Highly compatible with your current project requirements
                                </p>
                            </div>
                            <div className="profile-ai-match__score-wrap">
                                <span className="profile-ai-match__score-label">Match Score</span>
                                <span className="profile-ai-match__score">{matchPct}%</span>
                            </div>
                            <svg className="profile-ai-match__arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                <polyline points="17 6 23 6 23 12"/>
                            </svg>
                        </div>
                    )}

                    {/* About */}
                    {(bio || competencies.length > 0) && (
                        <div className="profile-section">
                            <h2 className="profile-section__title">About {name.split(" ")[0]}</h2>
                            {bio && <p className="profile-about__bio-main">{bio}</p>}
                            {bioDetail && <p className="profile-about__bio-detail">{bioDetail}</p>}
                            {competencies.length > 0 && (
                                <>
                                    <p className="profile-about__competencies-label">Core Competencies</p>
                                    <div className="profile-about__skills">
                                        {competencies.map((c, i) => (
                                            <span key={i} className="profile-about__skill-tag">{c}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Portfolio */}
                    {portfolio.length > 0 && (
                        <div className="profile-section">
                            <div className="profile-portfolio__header">
                                <h2 className="profile-section__title" style={{ margin: 0 }}>
                                    Portfolio Highlights
                                </h2>
                                <button className="profile-portfolio__view-all">View all work</button>
                            </div>
                            <div className="profile-portfolio__grid">
                                {portfolio.map((item, i) => (
                                    <PortfolioItem key={i} item={item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Projects */}
                    {projects.length > 0 && (
                        <div className="profile-section">
                            <h2 className="profile-section__title">Recent Projects</h2>
                            {visibleProjects.map((p, i) => (
                                <ProjectItem key={i} project={p} />
                            ))}
                            {projects.length > 2 && (
                                <div className="profile-load-more">
                                    <button
                                        className="profile-load-more__btn"
                                        onClick={() => setShowAllProjects((v) => !v)}
                                    >
                                        {showAllProjects ? "Show Less" : "Load More Experience"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ═══════════ RIGHT SIDEBAR ═══════════ */}
                <div className="profile-sidebar">

                    {/* Rate + Action Card */}
                    <div className="profile-rate-card">
                        <div className="profile-rate-card__header">
                            <span className="profile-rate-card__label">Hourly Rate</span>
                            <div className="profile-rate-card__bolt">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                </svg>
                            </div>
                        </div>

                        {hourlyRate != null && (
                            <p className="profile-rate-card__price">
                                ${hourlyRate}<span>/hr</span>
                            </p>
                        )}

                        <button
                            className="profile-rate-card__btn-hire"
                            onClick={() => onHire && onHire(profile)}
                        >
                            Hire {name.split(" ")[0]} Now
                        </button>

                        <button className="profile-rate-card__btn-msg">
                            Send Message
                        </button>

                        {/* Detail rows */}
                        <div className="profile-rate-card__details">
                            {availability && (
                                <div className="profile-rate-card__detail-row">
                                    <span className="profile-rate-card__detail-key">Availability</span>
                                    <span className="profile-rate-card__detail-val profile-rate-card__detail-val--green">
                                        {availability}
                                    </span>
                                </div>
                            )}
                            {responseTime && (
                                <div className="profile-rate-card__detail-row">
                                    <span className="profile-rate-card__detail-key">Response Time</span>
                                    <span className="profile-rate-card__detail-val">{responseTime}</span>
                                </div>
                            )}
                            {language && (
                                <div className="profile-rate-card__detail-row">
                                    <span className="profile-rate-card__detail-key">Language</span>
                                    <span className="profile-rate-card__detail-val">{language}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    {education.length > 0 && (
                        <div className="profile-edu-card">
                            <h3 className="profile-edu-card__title">Education</h3>
                            {education.map((edu, i) => (
                                <div key={i} className="profile-edu-item">
                                    <p className="profile-edu-item__degree">{edu.degree}</p>
                                    <p className="profile-edu-item__school">{edu.school}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Verifications */}
                    {verifications.length > 0 && (
                        <div className="profile-verify-card">
                            <h3 className="profile-verify-card__title">Verifications</h3>
                            {verifications.map((v, i) => (
                                <div key={i} className="profile-verify-item">
                                    <div className="profile-verify-item__check">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </div>
                                    {v}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FreelancerProfile;