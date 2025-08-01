# gemini_api_server.py

from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
model = genai.GenerativeModel("gemini-2.0-flash")

@app.route("/detect", methods=["POST"])
def detect():
    data = request.json
    text = data.get("text", "")
    user_id = data.get("user_id", "")

    prompt = (
        "You're an academic integrity agent. Analyze the following content and determine if it appears AI-generated. "
        "Include a confidence level (High / Medium / Low), and reasoning.\n\n"
        f"{text}"
    )

    try:
        response = model.generate_content(prompt)
        return jsonify({
            "analysis": response.text,
            "user_id": user_id
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
