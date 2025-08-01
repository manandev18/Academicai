# ai_detector.py

from gemini_wrapper import generate_with_gemini
import re

def parse_confidence_level(response_text: str) -> str:
    match = re.search(r"(High|Medium|Low)", response_text, re.IGNORECASE)
    if match:
        return match.group(1).capitalize()
    return "Unknown"

def risk_color(confidence: str) -> str:
    return {
        "High": "🔴 High Risk (AI-generated)",
        "Medium": "🟡 Medium Risk",
        "Low": "🟢 Low Risk",
    }.get(confidence, "⚪ Unknown")

def detect_ai_generated_content(draft_text: str) -> dict:
    prompt = (
        "You are an academic integrity agent. A student submitted this essay draft:\n\n"
        f"{draft_text}\n\n"
        "Does this appear to be written by an AI? "
        "Explain your reasoning and give a confidence level (High, Medium, Low)."
    )

    analysis = generate_with_gemini(prompt)
    confidence = parse_confidence_level(analysis)
    return {
        "confidence": confidence,
        "explanation": analysis,
        "indicator": risk_color(confidence)
    }
