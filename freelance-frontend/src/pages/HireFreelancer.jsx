import { useState } from "react";
import "./HireFreelancer.css";

// ── Helpers ──────────────────────────
function getInitials(name = "") {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const API_URL = "http://localhost:8080/api/contracts";

const DELIVERABLES = [
    "Source code repository with documentation",
    "Production-ready UI/UX design files",
    "API integration & technical hand-off",
    "2 weeks of post-launch support",
];

const DEFAULT_MILESTONE = { title: "", description: "", dueDate: "" };

// ── HireFreelancer Page ───────────────
function HireFreelancer({ freelancer, onBack }) {
    /*
      freelancer prop shape (passed from parent when clicking "Hire Now"):
      {
        id: string,
        name: string,
        skills: string,
        matchPercentage: number
      }
    */

    // ── Form state — maps EXACTLY to backend fields ──
    const [jobTitle, setJobTitle] = useState("");
    const [engagementType, setEngagementType] = useState("Fixed Price");
    const [projectDescription, setProjectDescription] = useState("");
    const [milestones, setMilestones] = useState([{ ...DEFAULT_MILESTONE }]);

    // ── UI state ──
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState("");
    const [errors, setErrors] = useState({});

    // ── Milestone handlers ──
    const addMilestone = () => {
        setMilestones((prev) => [...prev, { ...DEFAULT_MILESTONE }]);
    };

    const removeMilestone = (index) => {
        setMilestones((prev) => prev.filter((_, i) => i !== index));
    };

    const updateMilestone = (index, field, value) => {
        setMilestones((prev) =>
            prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
        );
    };

    // ── Validation ──
    const validate = () => {
        const newErrors = {};
        if (!jobTitle.trim()) newErrors.jobTitle = "Job title is required.";
        if (!projectDescription.trim()) newErrors.projectDescription = "Project description is required.";
        milestones.forEach((m, i) => {
            if (!m.title.trim()) newErrors[`milestone_${i}_title`] = "Milestone title is required.";
            if (!m.dueDate.trim()) newErrors[`milestone_${i}_dueDate`] = "Due date is required.";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Submit — POST /api/contracts ──
    const handleSubmit = () => {
        setApiError("");
        setSuccess(false);

        if (!validate()) return;

        // Request body matches backend EXACTLY
        const body = {
            freelancerId: String(freelancer?.id ?? ""),
            freelancerName: freelancer?.name ?? "",
            skills: freelancer?.skills ?? "",
            matchPercentage: freelancer?.matchPercentage ?? 0,
            jobTitle: jobTitle.trim(),
            engagementType,
            projectDescription: projectDescription.trim(),
            milestones: milestones.map((m) => ({
                title: m.title.trim(),
                description: m.description.trim(),
                dueDate: m.dueDate.trim(),
            })),
        };

        setSubmitting(true);

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then(() => {
                setSuccess(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch((err) => {
                setApiError(err.message || "Failed to send contract. Please try again.");
            })
            .finally(() => setSubmitting(false));
    };

    const freelancerName = freelancer?.name ?? "Freelancer";

    return (
        <div className="hire-page">

            {/* ── Breadcrumb ── */}
            <div className="hire-page__breadcrumb">
                <button className="hire-page__breadcrumb-link" onClick={onBack}>
                    History
                </button>
                <span className="hire-page__breadcrumb-sep">›</span>
                <span className="hire-page__breadcrumb-current">Hire {freelancerName}</span>
            </div>

            {/* ── Success Banner ── */}
            {success && (
                <div className="hire-success-banner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Contract sent successfully to {freelancerName}! They will be notified shortly.
                </div>
            )}

            {/* ── API Error Banner ── */}
            {apiError && (
                <div className="hire-error-banner">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {apiError}
                </div>
            )}

            <div className="hire-page__layout">

                {/* ═══════════════════════════
                    LEFT COLUMN
                ═══════════════════════════ */}
                <div className="hire-left-col">

                    {/* Freelancer info */}
                    <div className="hire-card hire-freelancer-card">
                        <div className="hire-freelancer-card__avatar">
                            {getInitials(freelancerName)}
                        </div>
                        <div className="hire-freelancer-card__info">
                            <p className="hire-freelancer-card__name">{freelancerName}</p>
                            <div className="hire-freelancer-card__meta">
                                <span>{freelancer?.skills ?? ""}</span>
                                <span className="hire-freelancer-card__dot">•</span>
                                <span className="hire-freelancer-card__match">
                                    {freelancer?.matchPercentage ?? 0}% Match
                                </span>
                            </div>
                        </div>
                        <button className="hire-freelancer-card__view-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            View Profile
                        </button>
                    </div>

                    {/* Contract Details form */}
                    <div className="hire-card hire-form-card">
                        <h2 className="hire-form-card__title">Contract Details</h2>
                        <p className="hire-form-card__subtitle">
                            Set up the terms for your engagement with {freelancerName}.
                        </p>

                        {/* Job Title */}
                        <div className="hire-form__group">
                            <label className="hire-form__label">Job Title</label>
                            <input
                                className={`hire-form__input${errors.jobTitle ? " hire-form__input--error" : ""}`}
                                type="text"
                                placeholder="e.g. Senior React Developer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                            {errors.jobTitle && (
                                <span className="hire-form__error-msg">{errors.jobTitle}</span>
                            )}
                        </div>

                        {/* Engagement Type */}
                        <div className="hire-form__group">
                            <label className="hire-form__label">Engagement Type</label>
                            <div className="hire-form__toggle">
                                {["Fixed Price", "Hourly"].map((type) => (
                                    <button
                                        key={type}
                                        className={`hire-form__toggle-btn${engagementType === type ? " hire-form__toggle-btn--active" : ""}`}
                                        onClick={() => setEngagementType(type)}
                                        type="button"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Project Description */}
                        <div className="hire-form__group">
                            <label className="hire-form__label">Project Description</label>
                            <textarea
                                className={`hire-form__textarea${errors.projectDescription ? " hire-form__textarea--error" : ""}`}
                                placeholder="Describe the project scope, goals, and key deliverables..."
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                            />
                            {errors.projectDescription && (
                                <span className="hire-form__error-msg">{errors.projectDescription}</span>
                            )}
                        </div>

                        {/* Milestones */}
                        <div className="hire-form__group">
                            <div className="hire-milestones__header">
                                <span className="hire-milestones__label">Milestones</span>
                                <button
                                    className="hire-milestones__add-btn"
                                    onClick={addMilestone}
                                    type="button"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                        <line x1="12" y1="5" x2="12" y2="19"/>
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                    </svg>
                                    Add Milestone
                                </button>
                            </div>

                            {milestones.map((milestone, index) => (
                                <div className="hire-milestone-item" key={index}>

                                    {/* Row: number + title preview + remove */}
                                    <div className="hire-milestone-item__row">
                                        <span className="hire-milestone-item__number">{index + 1}</span>
                                        <span className="hire-milestone-item__name-preview">
                                            {milestone.title || `Milestone ${index + 1}`}
                                        </span>
                                        {milestones.length > 1 && (
                                            <button
                                                className="hire-milestone-item__remove"
                                                onClick={() => removeMilestone(index)}
                                                type="button"
                                                aria-label="Remove milestone"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6l-1 14H6L5 6"/>
                                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                                    <path d="M9 6V4h6v2"/>
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Title + Due Date side by side */}
                                    <div className="hire-milestone-item__grid">
                                        <div className="hire-form__group">
                                            <label className="hire-form__label">Title</label>
                                            <input
                                                className={`hire-form__input${errors[`milestone_${index}_title`] ? " hire-form__input--error" : ""}`}
                                                type="text"
                                                placeholder="e.g. UI Design & Wireframing"
                                                value={milestone.title}
                                                onChange={(e) => updateMilestone(index, "title", e.target.value)}
                                            />
                                            {errors[`milestone_${index}_title`] && (
                                                <span className="hire-form__error-msg">
                                                    {errors[`milestone_${index}_title`]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="hire-form__group">
                                            <label className="hire-form__label">Due Date</label>
                                            <input
                                                className={`hire-form__input${errors[`milestone_${index}_dueDate`] ? " hire-form__input--error" : ""}`}
                                                type="text"
                                                placeholder="e.g. Week 1"
                                                value={milestone.dueDate}
                                                onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                                            />
                                            {errors[`milestone_${index}_dueDate`] && (
                                                <span className="hire-form__error-msg">
                                                    {errors[`milestone_${index}_dueDate`]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description full width */}
                                    <div className="hire-form__group">
                                        <label className="hire-form__label">Description</label>
                                        <textarea
                                            className="hire-form__textarea"
                                            style={{ minHeight: "70px" }}
                                            placeholder="Describe what will be delivered in this milestone..."
                                            value={milestone.description}
                                            onChange={(e) => updateMilestone(index, "description", e.target.value)}
                                        />
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* ═══════════════════════════
                    RIGHT SIDEBAR
                ═══════════════════════════ */}
                <div className="hire-sidebar">

                    {/* Project Deliverables */}
                    <div className="hire-card hire-deliverables-card">
                        <h3 className="hire-deliverables-card__title">Project Deliverables</h3>
                        <ul className="hire-deliverables-card__list">
                            {DELIVERABLES.map((item, i) => (
                                <li key={i} className="hire-deliverables-card__item">
                                    <div className="hire-deliverables-card__check">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Confirm & Send */}
                    <div className="hire-card hire-confirm-card">
                        <button
                            className="hire-confirm-card__btn"
                            onClick={handleSubmit}
                            disabled={submitting}
                            type="button"
                        >
                            {submitting ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.75s linear infinite" }}>
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="22" y1="2" x2="11" y2="13"/>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                </svg>
                            )}
                            {submitting ? "Sending..." : "Confirm & Send Contract"}
                        </button>
                        <p className="hire-confirm-card__legal">
                            By clicking confirm, you agree to our Terms of Service and
                            Freelancer Agreement.
                        </p>
                    </div>

                    {/* FreelanceAI Protection */}
                    <div className="hire-card hire-protection-card">
                        <div className="hire-protection-card__icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="hire-protection-card__title">FreelanceAI Protection</p>
                            <p className="hire-protection-card__text">
                                Your funds are held in escrow and only released
                                when milestones are approved.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HireFreelancer;