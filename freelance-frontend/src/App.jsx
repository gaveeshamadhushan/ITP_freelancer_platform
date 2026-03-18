import { useState } from "react";
import FreelancerPage from "./pages/FreelancerPage";
import RecommendationPage from "./pages/RecommendationPage";
import HistoryPage from "./pages/HistoryPage";
import HireFreelancer from "./pages/HireFreelancer";
import "./App.css";

function App() {
    const [page, setPage] = useState("recommendations");
    const [selectedFreelancer,setSelectedFreelancer]=useState(null);
    const handleHire = (freelancer) => {
        setSelectedFreelancer(freelancer);
        setPage("hire");
    };

    return (
        <div className="app">
            {/* ── Page Content ── */}
            <main className="app__content">
                {page === "recommendations" && <RecommendationPage onViewHistory={()=> setPage("history")} onHire={handleHire}/>}
                {page === "history"         && (
                    <HistoryPage onNewSearch={() => setPage("recommendations")} onHire={handleHire} />
                )}
                {page ==="hire" && <HireFreelancer freelancer ={selectedFreelancer} onBack={() => setPage("history")}/>}
            </main>
        </div>
    );
}

export default App;