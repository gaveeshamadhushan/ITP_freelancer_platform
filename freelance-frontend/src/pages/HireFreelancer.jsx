import {useState} from "react";
import "./HireFreelancer.css";

//---Helpers---
function getInitials(name=""){
    return name.split("").map((w) => w[0]).join("").toUpperCase().slice(0,2);
}

const API_URL="http://localhost:8080/api/contracts";

const DELIVERABLES =[
    "Source code repository with documentation",
    "Production-ready UI-UX design files",
    "API integration & technical hand-off",
    "2 weeks of post-launch support",
];

const  DEFAULT_MILESTONE ={title:"", description:"", dueDate:""};

//---Hire freelancer page----
function HireFreelancer({freelancer, onBack}){

    //---form state-maps exactly to backend fields---
    const [jobTitle,setJobTitle]=useState("");
    const [engagementType,setEngagementType]=useState("Fixed price");
    const [projectDescription,setProjectDescription]=useState("");
    const [milestones,setMilestones]=useState([{...DEFAULT_MILESTONE}]);

    //---UI State---
    const [submitting,setSubmitting]=useState(false);
    const [success,setSuccess]=useState(false);
    const [apiError,setApiError]=useState("");
    const [errors,setErrors]=useState({});

    //---mileStone handler---
    const addMilestone =()=>{
        setMilestones((prev) =>[...prev,{...DEFAULT_MILESTONE}]);
    };
    const removeMilestone=(index)=>{
        setMilestones((prev) =>prev.filter((_,i)=>i !== index));
    };
    const updateMilestone =(index, field, value)=>{
        setMilestones((prev) =>
            prev.map((m,i)=>(i===index ? {...m,[field]: value}:m))
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

    return(
        <div className="hire-page">
            <div className="hire-page__breadcrumb">
                <button className="hire-page__breadcrumb-link" onClick={onBack}>
                    History
                </button>
                <span className="hire-page__breadcrumb-sep"></span>
                <span className="hire-page__breadcrumb-current">Hire {freelancerName}</span>
            </div>

            {/*success banner*/}
            {success && (
                <div className="hire-success-banner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Contract sent successfully to {freelancerName}! They will be notified shortly.
                </div>
            )}

            {/*API Error banner*/}
            {apiError &&(
                <div className="hire-error-banner">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {apiError}
                </div>
            )}

            <div className="hire-page-layout">
                {/*LEFT COLUMN*/}
                <div className="hire-left-col">
                    {/*Freelancer info*/}
                    <div className="hire-card hire-freelancer-card">
                        <div className="hire-freelancer-card__avatar">
                            {getInitials(freelancerName)}
                        </div>
                        <div className="hire-freelancer-card__info">
                            <p className="hire-freelancer-card__name">{freelancerName}</p>
                            <div className="hire-freelancer-card__meta">
                                <span> {freelancer?.skills ?? ""}</span>
                                <span className="hire-freelancer-card__dot">•</span>
                                <span className="hire-freelancer-card__match">{freelancer?.matchPercentage ?? 0}% Match</span>
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

                    {/*Contract Details form*/}
                </div>
            </div>
        </div>
    )


}



export default HireFreelancer;