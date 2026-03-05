from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def recommend_freelancers(job_description, freelancers):
    """
    job_description: string
    freelancers: list of dictionaries -> [{"id":1, "skills":"React Java"}, ...]
    """

    # Combine job description and freelancer skills
    documents = [job_description] + [f["skills"] for f in freelancers]

    # Convert text to TF-IDF vectors
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Calculate cosine similarity
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    results = []

    for i, score in enumerate(similarities):
        percentage = round(float(score) * 100, 2)
        if(percentage>0):
            results.append({
                "freelancer_id": freelancers[i]["id"],
                "match_percentage": percentage
            })

    # Sort highest match first
    results = sorted(results, key=lambda x: x["match_percentage"], reverse=True)
    results = results[:3]

    return results