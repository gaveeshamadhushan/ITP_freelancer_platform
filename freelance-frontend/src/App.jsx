import { useState } from "react";
import FreelancerPage from "./pages/FreelancerPage";
import RecommendationPage from "./pages/RecommendationPage";
import HistoryPage from "./pages/HistoryPage";
import HireFreelancer from "./pages/HireFreelancer";
import FreelancerProfile from "./pages/FreelancerProfile";
import MyContracts from "./pages/MyContracts";
import "./App.css";

function App() {
    const [page, setPage] = useState("recommendations");
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);

    // Remember where the user came from so "back" returns correctly
    const [previousPage, setPreviousPage] = useState("recommendations");

    /* ── Navigate to Hire page ── */
    const handleHire = (freelancer, from = page) => {
        if (!freelancer) return;
        setSelectedFreelancer(freelancer);
        setPreviousPage(from);
        setPage("hire");
    };

    /* ── Navigate to Profile page ── */
    const handleViewProfile = (freelancer, from = page) => {
        if (!freelancer) return;           // null guard — prevents blank page
        setSelectedFreelancer(freelancer);
        setPreviousPage(from);
        setPage("profile");
    };

    /* ── Go back to wherever the user came from ── */
    const handleBack = () => setPage(previousPage);

    return (
        <div className="app">
            <main className="app__content">

                {page === "recommendations" && (
                    <RecommendationPage
                        onViewHistory={() => setPage("history")}
                        onHire={(f) => handleHire(f, "recommendations")}
                        onViewProfile={(f) => handleViewProfile(f, "recommendations")}
                    />
                )}

                {page === "history" && (
                    <HistoryPage
                        onNewSearch={() => setPage("recommendations")}
                        onHire={(f) => handleHire(f, "history")}
                        onViewProfile={(f) => handleViewProfile(f, "history")}
                    />
                )}

                {page === "contracts" && (
                    <MyContracts
                        onBack={handleBack}
                        onBrowseJobs={() => setPage("recommendations")}
                    />
                )}

                {page === "hire" && selectedFreelancer && (
                    <HireFreelancer
                        freelancer={selectedFreelancer}
                        onBack={handleBack}
                        onViewProfile={(f) => handleViewProfile(f, "hire")}
                        onViewContracts={() => {
                            setPreviousPage("hire");
                            setPage("contracts");
                        }}
                    />
                )}

                {page === "profile" && selectedFreelancer && (
                    <FreelancerProfile
                        freelancer={selectedFreelancer}
                        onBack={handleBack}
                        onHire={(f) => handleHire(f, "profile")}
                        onViewContracts={() => {
                            setPreviousPage("profile");
                            setPage("contracts");
                        }}
                    />
                )}

                {/* Safety net: if profile/hire page reached with no freelancer, go back */}
                {(page === "profile" || page === "hire") && !selectedFreelancer && (
                    <div style={{ padding: "48px", textAlign: "center", fontFamily: "DM Sans, sans-serif", color: "#64748b" }}>
                        <p>No freelancer selected.</p>
                        <button
                            onClick={() => setPage("recommendations")}
                            style={{ marginTop: "16px", padding: "10px 20px", background: "#1d3fbb", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
                        >
                            Browse Freelancers
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}

export default App;