import { useState } from "react";
import FreelancerPage from "./pages/FreelancerPage";
import RecommendationPage from "./pages/RecommendationPage";
import HistoryPage from "./pages/HistoryPage";
import "./App.css";

function App() {
    const [page, setPage] = useState("recommendations");

    return (
        <div className="app">
            {/* ── Page Content ── */}
            <main className="app__content">
                {page === "recommendations" && <RecommendationPage onViewHistory={()=> setPage("history")}/>}
                {page === "history"         && (
                    <HistoryPage onNewSearch={() => setPage("recommendations")} />
                )}
            </main>
        </div>
    );
}

export default App;