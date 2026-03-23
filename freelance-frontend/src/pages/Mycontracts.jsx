import { useState, useEffect, useCallback } from "react";
import "./MyContracts.css";

/* ─────────────────────────────────────
   CONSTANTS
───────────────────────────────────── */
const API_BASE = "http://localhost:8080/api/contracts";

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
function getInitials(name = "") {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

/* ─────────────────────────────────────
   STATUS BADGE
───────────────────────────────────── */
function StatusBadge({ status }) {
    const map = {
        PENDING:  "contract-badge--pending",
        ACTIVE:   "contract-badge--active",
        REJECTED: "contract-badge--rejected",
    };
    const cls = map[status?.toUpperCase()] ?? "contract-badge--default";
    return <span className={`contract-badge ${cls}`}>{status}</span>;
}

/* ─────────────────────────────────────
   ENGAGEMENT ICON
───────────────────────────────────── */
function EngagementIcon({ type }) {
    const t = (type ?? "").toLowerCase();
    if (t.includes("fixed")) {
        return (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        );
    }
    if (t.includes("hourly")) {
        return (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
            </svg>
        );
    }
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
        </svg>
    );
}

/* ─────────────────────────────────────
   CONTRACT CARD
───────────────────────────────────── */
function ContractCard({ contract, onStatusUpdate }) {
    const [updating, setUpdating] = useState(null); // "ACTIVE" | "REJECTED" | null
    const status = (contract.status ?? "PENDING").toUpperCase();

    // PUT /api/contracts/{id}/status?status=ACTIVE|REJECTED
    const updateStatus = (newStatus) => {
        setUpdating(newStatus);
        fetch(`${API_BASE}/${contract.id}/status?status=${newStatus}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to update status (${res.status})`);
                return res.json();
            })
            .then((updated) => {
                onStatusUpdate(contract.id, newStatus, updated);
            })
            .catch((err) => {
                onStatusUpdate(contract.id, null, null, err.message);
            })
            .finally(() => setUpdating(null));
    };

    const freelancerName = contract.freelancerName ?? contract.freelanceId ?? "Unknown";

    return (
        <div className="contract-card">

            {/* Top: status badge + date */}
            <div className="contract-card__top">
                <StatusBadge status={contract.status ?? "PENDING"} />
                <span className="contract-card__date">
                    {formatDate(contract.createdAt ?? contract.date)}
                </span>
            </div>

            {/* Title */}
            <h3 className="contract-card__title">
                {contract.jobTitle ?? "Untitled Contract"}
            </h3>

            {/* Engagement type */}
            {contract.engagementType && (
                <div className="contract-card__engagement">
                    <EngagementIcon type={contract.engagementType} />
                    {contract.engagementType}
                </div>
            )}

            {/* Description */}
            {contract.projectDescription && (
                <p className="contract-card__description">
                    {contract.projectDescription}
                </p>
            )}

            {/* Freelancer */}
            <div className="contract-card__freelancer">
                <div className="contract-card__avatar">
                    {getInitials(freelancerName)}
                </div>
                <div className="contract-card__freelancer-info">
                    <p className="contract-card__freelancer-name">{freelancerName}</p>
                    <p className="contract-card__freelancer-role">
                        {contract.skills ?? contract.freelancerRole ?? ""}
                    </p>
                </div>
            </div>

            {/* Action buttons — depend on status */}
            <div className="contract-card__actions">
                {status === "PENDING" && (
                    <>
                        <button
                            className="contract-btn-accept"
                            onClick={() => updateStatus("ACTIVE")}
                            disabled={updating !== null}
                        >
                            {updating === "ACTIVE" && (
                                <span className="contract-btn-spinner" />
                            )}
                            Accept
                        </button>
                        <button
                            className="contract-btn-reject"
                            onClick={() => updateStatus("REJECTED")}
                            disabled={updating !== null}
                        >
                            {updating === "REJECTED" && (
                                <span className="contract-btn-spinner"
                                      style={{ borderColor: "rgba(0,0,0,0.2)", borderTopColor: "#374151" }}
                                />
                            )}
                            Reject
                        </button>
                    </>
                )}

                {status === "ACTIVE" && (
                    <button className="contract-btn-view">
                        View Details
                    </button>
                )}

                {status === "REJECTED" && (
                    <button className="contract-btn-archive">
                        Archive Contract
                    </button>
                )}

                {/* Fallback for unknown statuses */}
                {!["PENDING", "ACTIVE", "REJECTED"].includes(status) && (
                    <button className="contract-btn-view">
                        View Details
                    </button>
                )}
            </div>

        </div>
    );
}

/* ─────────────────────────────────────
   EMPTY / ARCHIVED STATE
───────────────────────────────────── */
function ArchivedEmpty({ onBrowse }) {
    return (
        <div className="contracts-archived">
            <div className="contracts-archived__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23"/>
                    <path d="M21 21H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3m3-3h6l2 3H9L11 2zm-6 6h12"/>
                </svg>
            </div>
            <h3 className="contracts-archived__title">No Archived Contracts</h3>
            <p className="contracts-archived__subtitle">
                You don't have any archived or past contracts yet. Once an
                engagement ends or is declined, it will appear here for your records.
            </p>
            <button className="contracts-archived__btn" onClick={onBrowse}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Browse New Jobs
            </button>
        </div>
    );
}

/* ─────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────── */
function Toast({ message, type }) {
    if (!message) return null;
    return (
        <div className={`contracts-toast contracts-toast--${type}`}>
            {type === "success" ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            )}
            {message}
        </div>
    );
}

/* ─────────────────────────────────────
   MAIN PAGE
───────────────────────────────────── */
function MyContracts({ onBrowseJobs }) {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");
    const [toast, setToast]         = useState(null); // { message, type }

    /* ── Show toast then auto-dismiss ── */
    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    /* ── Fetch all contracts: GET /api/contracts ── */
    const fetchContracts = useCallback(() => {
        setLoading(true);
        setError("");
        fetch(API_BASE)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load contracts (${res.status})`);
                return res.json();
            })
            .then((data) => setContracts(Array.isArray(data) ? data : []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    /* ── Handle status update response from child ── */
    const handleStatusUpdate = useCallback((id, newStatus, updatedContract, errMsg) => {
        if (errMsg) {
            showToast(`Failed to update contract: ${errMsg}`, "error");
            return;
        }
        // Optimistically update in-place; replace with server response if available
        setContracts((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;
                return updatedContract ?? { ...c, status: newStatus };
            })
        );
        showToast(
            newStatus === "ACTIVE"
                ? "Contract accepted successfully!"
                : "Contract rejected.",
            "success"
        );
    }, [showToast]);

    /* ── Export to CSV ── */
    const exportCSV = () => {
        if (contracts.length === 0) return;
        const headers = ["ID", "Job Title", "Engagement Type", "Status", "Freelancer", "Description", "Created At"];
        const rows = contracts.map((c) => [
            c.id ?? "",
            c.jobTitle ?? "",
            c.engagementType ?? "",
            c.status ?? "PENDING",
            c.freelancerName ?? c.freelanceId ?? "",
            (c.projectDescription ?? "").replace(/,/g, ";"),
            c.createdAt ?? "",
        ]);
        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = "contracts.csv";
        a.click();
        URL.revokeObjectURL(url);
        showToast("CSV exported successfully!");
    };

    /* ── Separate active from archived ── */
    const activeContracts   = contracts.filter((c) =>
        ["PENDING", "ACTIVE"].includes((c.status ?? "PENDING").toUpperCase())
    );
    const archivedContracts = contracts.filter((c) =>
        ["REJECTED", "ARCHIVED", "COMPLETED"].includes((c.status ?? "PENDING").toUpperCase())
    );

    return (
        <div className="contracts-page">

            {/* ── Header ── */}
            <div className="contracts-page__header">
                <div className="contracts-page__header-left">
                    <h2 className="contracts-page__title">Contracts</h2>
                    <p className="contracts-page__subtitle">
                        Manage your professional agreements and active engagements.
                    </p>
                </div>
                <div className="contracts-page__actions">
                    <button className="contracts-btn-filter" onClick={fetchContracts}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                            <line x1="11" y1="18" x2="13" y2="18"/>
                        </svg>
                        Filter by Status
                    </button>
                    <button className="contracts-btn-export" onClick={exportCSV}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div className="contracts-loading">
                    <div className="contracts-loading__spinner" />
                    <p className="contracts-loading__text">Loading your contracts…</p>
                    <div className="contracts-loading__dots">
                        <span className="contracts-loading__dot" />
                        <span className="contracts-loading__dot" />
                        <span className="contracts-loading__dot" />
                    </div>
                </div>
            )}

            {/* ── Fetch Error ── */}
            {error && !loading && (
                <div className="contracts-error">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Active Contracts Grid ── */}
            {!loading && !error && (
                <div className="contracts-section">
                    {activeContracts.length > 0 ? (
                        <div className="contracts-grid">
                            {activeContracts.map((contract) => (
                                <ContractCard
                                    key={contract.id}
                                    contract={contract}
                                    onStatusUpdate={handleStatusUpdate}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Show empty state inline if no active contracts at all */
                        contracts.length === 0 && (
                            <div className="contracts-archived" style={{ marginBottom: "28px" }}>
                                <div className="contracts-archived__icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <line x1="10" y1="9" x2="8" y2="9"/>
                                    </svg>
                                </div>
                                <h3 className="contracts-archived__title">No Contracts Yet</h3>
                                <p className="contracts-archived__subtitle">
                                    You haven't sent or received any contracts yet.
                                    Start by finding a freelancer and sending a contract proposal.
                                </p>
                                <button
                                    className="contracts-archived__btn"
                                    onClick={onBrowseJobs}
                                >
                                    Find Freelancers
                                </button>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* ── Archived Section (rejected / completed) ── */}
            {!loading && !error && (
                archivedContracts.length > 0 ? (
                    <div className="contracts-section">
                        <div className="contracts-grid">
                            {archivedContracts.map((contract) => (
                                <ContractCard
                                    key={contract.id}
                                    contract={contract}
                                    onStatusUpdate={handleStatusUpdate}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Always show the archived empty state at the bottom */
                    <ArchivedEmpty onBrowse={onBrowseJobs} />
                )
            )}

            {/* ── Toast Notification ── */}
            {toast && <Toast message={toast.message} type={toast.type} />}

        </div>
    );
}

export default MyContracts;