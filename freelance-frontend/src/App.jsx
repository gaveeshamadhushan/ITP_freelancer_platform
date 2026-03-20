import { useState } from "react";
import FreelancerPage from "./pages/FreelancerPage";
import RecommendationPage from "./pages/RecommendationPage";
import HistoryPage from "./pages/HistoryPage";
import HireFreelancer from "./pages/HireFreelancer";
import FreelancerProfile from "./pages/FreelancerProfile";
import "./App.css";

function App() {
    const [page, setPage] = useState("recommendations");
    const [selectedFreelancer,setSelectedFreelancer]=useState(null);
    const handleHire = (freelancer) => {
        setSelectedFreelancer(freelancer);
        setPage("hire");
    };

    // Navigate to Profile page (View Profile button)
    const handleViewProfile = (freelancer) => {
        setSelectedFreelancer(freelancer);
        setPage("profile");
    };

    return (
        <div className="app">
            {/* ── Page Content ── */}
            <main className="app__content">
                {page === "recommendations" && <RecommendationPage onViewHistory={()=> setPage("history")} onHire={handleHire} onViewProfile={handleViewProfile}/>}
                {page === "history"         && (
                    <HistoryPage onNewSearch={() => setPage("recommendations")} onHire={handleHire} onViewProfile={handleViewProfile} />
                )}
                {page ==="hire" && <HireFreelancer freelancer ={selectedFreelancer} onBack={() => setPage("history")} onViewProfile={handleViewProfile}/>}
                {page === "profile" && (
                    <FreelancerProfile
                        freelancer={selectedFreelancer}
                        onBack={() => setPage("history")}
                        onHire={handleHire}
                    />
                )}
            </main>
        </div>
    );
}

export default App;