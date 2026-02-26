import { useEffect, useState } from "react";
import "./FreelancerPage.css";

// Assign a consistent avatar color class based on name
const AVATAR_COLORS = [
    "avatar--blue",
    "avatar--indigo",
    "avatar--green",
    "avatar--orange",
    "avatar--purple",
    "avatar--pink",
];

function getAvatarColor(name = "") {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(name = "") {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function FreelancerPage() {
    const [freelancers, setFreelancers] = useState([]);
    const [name, setName] = useState("");
    const [skills, setSkills] = useState("");

    const API_URL = "http://localhost:8080/api/freelancers";

    useEffect(() => {
        fetchFreelancers();
    }, []);

    const fetchFreelancers = () => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setFreelancers(data));
    };

    const addFreelancer = () => {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, skills }),
        }).then(() => {
            setName("");
            setSkills("");
            fetchFreelancers();
        });
    };

    const deleteFreelancer = (id) => {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        }).then(() => fetchFreelancers());
    };

    return (
        <div className="freelancer-page">
            {/* ── Page Header ── */}
            <div className="freelancer-page__header">
                <h2 className="freelancer-page__title">Manage Freelancers</h2>
                <p className="freelancer-page__subtitle">
                    Add new talent to your roster and oversee your existing team of professionals.
                </p>
            </div>

            {/* ── Add Freelancer Card ── */}
            <div className="freelancer-card">
                <h3 className="freelancer-form__heading">
                    {/* Person-add icon */}
                    <svg
                        className="freelancer-form__heading-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="16" y1="11" x2="22" y2="11" />
                    </svg>
                    Add New Freelancer
                </h3>

                <div className="freelancer-form__fields">
                    <div className="freelancer-form__field">
                        <label className="freelancer-form__label">Full Name</label>
                        <input
                            className="freelancer-form__input"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="freelancer-form__field">
                        <label className="freelancer-form__label">Primary Skills</label>
                        <input
                            className="freelancer-form__input"
                            placeholder="e.g. React, UI/UX"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>
                </div>

                <button className="freelancer-form__submit" onClick={addFreelancer}>
                    {/* Plus icon */}
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Freelancer
                </button>
            </div>

            {/* ── Talent Pool Card ── */}
            <div className="freelancer-card">
                <div className="talent-pool__header">
                    <h3 className="talent-pool__title">Current Talent Pool</h3>
                    <span className="talent-pool__badge">
            {freelancers.length} Freelancer{freelancers.length !== 1 ? "s" : ""}
          </span>
                </div>

                <ul className="talent-pool__list">
                    {freelancers.map((f) => (
                        <li key={f.id} className="talent-pool__item">
                            {/* Avatar */}
                            <div className={`talent-pool__avatar ${getAvatarColor(f.name)}`}>
                                {getInitials(f.name)}
                            </div>

                            {/* Info */}
                            <div className="talent-pool__info">
                                <p className="talent-pool__name">{f.name}</p>
                                <div className="talent-pool__skills">
                                    {f.skills
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean)
                                        .map((skill, idx) => (
                                            <span key={idx} className="skill-tag">
                        {skill}
                      </span>
                                        ))}
                                </div>
                            </div>

                            {/* Delete */}
                            <button
                                className="talent-pool__delete"
                                onClick={() => deleteFreelancer(f.id)}
                                aria-label={`Delete ${f.name}`}
                            >
                                {/* Trash icon */}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>

                <a className="talent-pool__view-all" href="#">
                    View All Freelancers
                </a>
            </div>

            {/* ── Stats Row ── */}
            <div className="freelancer-stats">
                <div className="stat-card">
                    <div className="stat-card__label">Total Active</div>
                    <div className="stat-card__value">24</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__label">Available Now</div>
                    <div className="stat-card__value">12</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__label">Average Rating</div>
                    <div className="stat-card__value">
                        4.9 <span className="stat-card__star">★</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FreelancerPage;