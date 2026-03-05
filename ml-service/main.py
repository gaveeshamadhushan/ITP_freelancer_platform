from flask import Flask, request, jsonify
from app.recommender import recommend_freelancers

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    job_description = data.get("job_description")
    freelancers = data.get("freelancers")

    if not job_description or not freelancers:
        return jsonify({"error": "Invalid input"}), 400

    results = recommend_freelancers(job_description, freelancers)

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True, port=5000)