import { useState } from "react";
import FreelancerPage from "./pages/FreelancerPage";
import RecommendationPage from "./pages/RecommendationPage";
import "./App.css";

function App() {
    const [page, setPage] = useState("recommendations");

    return (
        <div className="app">
            {/* ── Page Content ── */}
            <main className="app__content">
                {page === "recommendations" && <RecommendationPage />}
            </main>
        </div>
    );
}

export default App;