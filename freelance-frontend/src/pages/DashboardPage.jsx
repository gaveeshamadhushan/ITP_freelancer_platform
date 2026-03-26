import { useState, useEffect, useRef } from "react";
import "./DashboardPage.css";

/* ─────────────────────────────────────
   CONSTANTS
───────────────────────────────────── */
const ANALYTICS_URL = "http://localhost:8080/api/recommendations/analytics";

// AI insight bullet points per freelancer (UI-only, no backend dependency)
const AI_INSIGHTS = [
    ["Matches 5/5 core skills", "Previous high-performance in sector", "Available for immediate start"],
    ["Expert in distributed systems", "Fits company cultural values", "Strong portfolio in Fintech"],
    ["10+ years enterprise experience", "Top 1% collaborator score", "Multilingual communication skills"],
];

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
function getInitials(name = "") {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatNumber(n) {
    if (n == null) return "—";
    return Number(n).toLocaleString("en-US");
}

/* ─────────────────────────────────────
   DONUT CHART (CSS SVG)
   Renders the circular progress ring for
   the average match score
───────────────────────────────────── */
function DonutChart({ value = 0, max = 100 }) {
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(Math.max(value / max, 0), 1);
    const offset = circumference * (1 - pct);

    return (
        <div className="dashboard-donut">
            <svg viewBox="0 0 110 110">
                <circle className="dashboard-donut__track" cx="55" cy="55" r={radius} />
                <circle
                    className="dashboard-donut__fill"
                    cx="55"
                    cy="55"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="dashboard-donut__icon">
                <div className="dashboard-donut__icon-circle">
                    <svg viewBox="0 0 24 24">
                        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────
   BAR CHART
   Renders top freelancers as vertical bars
───────────────────────────────────── */
function BarChart({ freelancers = [] }) {
    const [mounted, setMounted] = useState(false);

    // Trigger bar animation after mount
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(t);
    }, []);

    if (freelancers.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8", fontSize: "14px" }}>
                No data available
            </div>
        );
    }

    const maxCount = Math.max(...freelancers.map((f) => f.count ?? 0), 1);

    return (
        <div className="dashboard-bar-chart">
            {freelancers.map((f, i) => {
                const heightPct = mounted ? ((f.count ?? 0) / maxCount) * 100 : 0;
                // Highlight the tallest bar
                const isHighlight = (f.count ?? 0) === maxCount;
                // Show only last name for label
                const lastName = (f.name ?? "").split(" ").pop()?.toUpperCase() ?? "";

                return (
                    <div key={i} className="dashboard-bar-col">
                        <div className="dashboard-bar-col__bar-wrap">
                            <div
                                className={`dashboard-bar-col__bar${isHighlight ? " dashboard-bar-col__bar--highlight" : ""}`}
                                style={{ height: `${heightPct}%` }}
                            />
                        </div>
                        <span className="dashboard-bar-col__label">{lastName}</span>
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────
   MATCH CARD
───────────────────────────────────── */
function MatchCard({ freelancer, index, onHire, onViewProfile }) {
    const insights = AI_INSIGHTS[index % AI_INSIGHTS.length];
    const matchPct = freelancer.matchPercentage ?? freelancer.count ?? 90;

    return (
        <div className="dashboard-match-card">
            {/* Top: avatar + name + badge */}
            <div className="dashboard-match-card__top">
                <div className="dashboard-match-card__avatar">
                    {getInitials(freelancer.name)}
                </div>
                <div className="dashboard-match-card__info">
                    <p className="dashboard-match-card__name">{freelancer.name}</p>
                    <p className="dashboard-match-card__role">
                        {freelancer.skills ?? freelancer.role ?? "Top Freelancer"}
                    </p>
                </div>
                <div className="dashboard-match-card__badge">
                    <span className="dashboard-match-card__badge-pct">{matchPct}%</span>
                    <span className="dashboard-match-card__badge-label">Match</span>
                </div>
            </div>

            {/* AI Insights */}
            <div className="dashboard-match-card__insights">
                <div className="dashboard-match-card__insights-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="4"/>
                    </svg>
                    AI Insights
                </div>
                {insights.map((insight, i) => (
                    <div key={i} className="dashboard-match-card__insight-item">
                        <div className="dashboard-match-card__insight-dot">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        {insight}
                    </div>
                ))}
            </div>

            {/* Action buttons */}
            <div className="dashboard-match-card__actions">
                <button
                    className="dashboard-match-card__btn-hire"
                    onClick={() => onHire && onHire(freelancer)}
                >
                    Hire Now
                </button>
                <button
                    className="dashboard-match-card__btn-profile"
                    onClick={() => onViewProfile && onViewProfile(freelancer)}
                >
                    View Profile
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────
   MAIN DASHBOARD PAGE
───────────────────────────────────── */
function DashboardPage({ onHire, onViewProfile }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const [period, setPeriod]       = useState("monthly"); // "7days" | "monthly"

    /* ── Fetch: GET /api/recommendations/analytics ── */
    useEffect(() => {
        setLoading(true);
        setError("");

        fetch(ANALYTICS_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load analytics (${res.status})`);
                return res.json();
            })
            .then((data) => setAnalytics(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [period]); // re-fetch when period changes

    /* ── Derived values ── */
    const totalRec    = analytics?.totalRecommendations ?? 0;
    const avgScore    = analytics?.averageMatchScore ?? 0;
    const topList     = analytics?.topFreelancers ?? [];

    // Show top 3 in Recent Top Matches section
    const topMatches  = topList.slice(0, 3);

    return (
        <div className="dashboard-page">

            {/* ── Page Header ── */}
            <div className="dashboard-page__header">
                <div className="dashboard-page__header-left">
                    <h2 className="dashboard-page__title">AI Recommendation Insights</h2>
                    <p className="dashboard-page__subtitle">
                        Curated intelligence for your project's next key contributor.
                    </p>
                </div>

                {/* Period toggle */}
                <div className="dashboard-period-toggle">
                    <button
                        className={`dashboard-period-toggle__btn${period === "7days" ? " dashboard-period-toggle__btn--active" : ""}`}
                        onClick={() => setPeriod("7days")}
                    >
                        Last 7 Days
                    </button>
                    <button
                        className={`dashboard-period-toggle__btn${period === "monthly" ? " dashboard-period-toggle__btn--active" : ""}`}
                        onClick={() => setPeriod("monthly")}
                    >
                        Monthly
                    </button>
                    <div className="dashboard-period-toggle__icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="dashboard-error">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Loading ── */}
            {loading && (
                <div className="dashboard-loading">
                    <div className="dashboard-loading__spinner" />
                    <p className="dashboard-loading__text">Loading analytics…</p>
                    <div className="dashboard-loading__dots">
                        <span className="dashboard-loading__dot" />
                        <span className="dashboard-loading__dot" />
                        <span className="dashboard-loading__dot" />
                    </div>
                </div>
            )}

            {!loading && analytics && (
                <>
                    {/* ── Stats Hero Card ── */}
                    <div className="dashboard-stats-grid">

                        {/* Total Recommendations */}
                        <div className="dashboard-stat-card">
                            <p className="dashboard-stat__label">Total Recommendations</p>
                            <p className="dashboard-stat__value">
                                {formatNumber(totalRec)}
                                <span className="dashboard-stat__growth">+12.4%</span>
                            </p>
                        </div>

                        {/* Average Match Score */}
                        <div className="dashboard-stat-card dashboard-stat-card--score">
                            <div>
                                <p className="dashboard-stat__label">Average Match Score</p>
                                <p className="dashboard-stat__value">
                                    {avgScore}
                                    <span className="dashboard-stat__value-unit">%</span>
                                </p>
                                <p className="dashboard-stat__desc">
                                    Our AI identifies freelancers with a significantly
                                    higher success probability than traditional search.
                                </p>
                            </div>

                            <DonutChart value={avgScore} max={100} />
                        </div>

                    </div>

                    {/* ── Top Freelancers Bar Chart Card ── */}
                    <div className="dashboard-top-card">
                        <div className="dashboard-top-card__header">
                            <div>
                                <h3 className="dashboard-top-card__title">Top Freelancers</h3>
                                <p className="dashboard-top-card__subtitle">
                                    Most recommended talents across your active job postings.
                                </p>
                            </div>
                            <button
                                className="dashboard-top-card__download"
                                onClick={() => window.open(ANALYTICS_URL, "_blank")}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Download Report
                            </button>
                        </div>

                        <BarChart freelancers={topList} />
                    </div>

                    {/* ── Recent Top Matches ── */}
                    {topMatches.length > 0 && (
                        <>
                            <div className="dashboard-matches__header">
                                <h3 className="dashboard-matches__title">Recent Top Matches</h3>
                                <div className="dashboard-matches__filter-btns">
                                    <button className="dashboard-matches__filter-btn">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <line x1="4" y1="6" x2="20" y2="6"/>
                                            <line x1="8" y1="12" x2="16" y2="12"/>
                                            <line x1="11" y1="18" x2="13" y2="18"/>
                                        </svg>
                                    </button>
                                    <button className="dashboard-matches__filter-btn">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <line x1="4" y1="6" x2="20" y2="6"/>
                                            <line x1="8" y1="12" x2="16" y2="12"/>
                                            <line x1="11" y1="18" x2="13" y2="18"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="dashboard-matches__grid">
                                {topMatches.map((freelancer, i) => (
                                    <MatchCard
                                        key={freelancer.name ?? i}
                                        freelancer={freelancer}
                                        index={i}
                                        onHire={onHire}
                                        onViewProfile={onViewProfile}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Empty state when no data */}
            {!loading && !error && !analytics && (
                <div style={{ textAlign: "center", padding: "80px 24px", color: "#94a3b8", fontFamily: "DM Sans, sans-serif" }}>
                    <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>No analytics data yet</p>
                    <p style={{ fontSize: "14px" }}>Run some AI recommendations to start seeing insights here.</p>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;