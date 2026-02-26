import { useState } from "react";
import FreelancerPage from "./pages/FreelancerPage";
import RecommendationPage from "./pages/RecommendationPage";
import "./App.css";

function App() {
    const [page, setPage] = useState("freelancers");

    return (
        <div className="app">
            {/* ── Top Navbar ── */}
            <header className="navbar">
                <div className="navbar__left">
                    {/* Nav Links */}
                    <nav className="navbar__links">
                        <button
                            className={`navbar__link ${page === "recommendations" ? "navbar__link--active" : ""}`}
                            onClick={() => setPage("recommendations")}
                        >
                            Find Freelancers
                        </button>
                    </nav>
                </div>
            </header>
            {/* ── Page Content ── */}
            <main className="app__content">
                {page === "freelancers" && <FreelancerPage />}
                {page === "recommendations" && <RecommendationPage />}
            </main>
        </div>
    );
}

export default App;