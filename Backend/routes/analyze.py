from utils.sanitizer import sanitize_payload, is_payload_valid
from core.detector import detect_attack
from core.simulator import simulate_attack
from core.explainer import generate_explanation

from flask import Blueprint, request, jsonify

analyze_bp = Blueprint("analyze", __name__)

@analyze_bp.route("/analyze", methods=["POST"])
def analyze_payload():
    data = request.get_json()
    payload = sanitize_payload(data.get("payload"))
    lab = data.get("lab", "unknown")

    if not is_payload_valid(payload):
        return jsonify({"error": "Invalid or empty payload provided."}), 400

    attack_result = detect_attack(payload)
    attack_type = attack_result["attack_type"]
    simulation = simulate_attack(attack_type, lab)
    explanation = generate_explanation(attack_type, lab, payload)

    return jsonify({
        "payload": payload,
        "lab": lab,
        "attack_type": attack_type,
        "confidence": attack_result["confidence"],
        "simulation": simulation,
        "explanation": explanation
    }), 200
