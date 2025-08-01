# app.py

import streamlit as st
import os
from dotenv import load_dotenv

# Import modules
from save_data import save_assignment_data, save_ai_detection_report
from config import breakdown_assignment, review_draft
from firebase_utils.firebase_config import db
from firebase_utils.auth_utils import login_user, create_user
from pdf_export import export_feedback_to_pdf
from ai_detector import detect_ai_generated_content
# Load environment variables
load_dotenv()
API_KEY = os.getenv("WEB_API_KEY")

# Page setup
st.set_page_config(page_title="Academic Integrity Agent", layout="wide")
st.title("📘 Academic Integrity Agent")

# --- Login / Sign-up Section ---
auth_choice = st.radio("Login or Sign Up", ["Login", "Sign Up"])

if auth_choice == "Sign Up":
    full_name = st.text_input("Full Name")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    if st.button("Create Account"):
        success, message = create_user(email, password, full_name)
        if success:
            st.success(message)
        else:
            st.error(message)

if auth_choice == "Login":
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        success, result = login_user(email, password, API_KEY)
        if success:
            st.success("✅ Login successful!")
            st.session_state["user_email"] = email
            st.session_state["id_token"] = result["idToken"]
        else:
            st.error(f"❌ Login failed: {result}")

# --- Main Agent Tools (only if logged in) ---
if "user_email" in st.session_state:
    user_id = st.session_state["user_email"]
    st.subheader(f"Welcome, {user_id.split('@')[0].title()}! 🎓")

    # Assignment Prompt
    prompt = st.text_area("📥 Assignment Prompt")
    if st.button("🔍 Break Down"):
        breakdown = breakdown_assignment(prompt)
        st.markdown("### 🧠 Assignment Breakdown")
        st.markdown(breakdown)
        st.session_state["breakdown"] = breakdown

    # Essay Draft
    draft = st.text_area("✍️ Essay Draft")
    if st.button("💬 Get Feedback"):
        feedback = review_draft(draft)
        st.markdown("### ✅ Feedback")
        st.markdown(feedback)
        st.session_state["feedback"] = feedback

    # Save Data
    if st.button("💾 Save This Session"):
        save_assignment_data(
            user_id,
            prompt,
            st.session_state.get("breakdown", ""),
            st.session_state.get("feedback", "")
        )
        st.success("📝 Session saved successfully!")

    # View Past Sessions
    if st.checkbox("📂 View My Past Sessions"):
        docs = db.collection("assignments").where("user_id", "==", user_id).stream()
        st.markdown("### 🗃️ Past Sessions")
        for doc in docs:
            data = doc.to_dict()
            st.write(f"🕒 {data['timestamp'].strftime('%Y-%m-%d %H:%M')}")
            st.markdown(f"**Prompt**: {data['prompt']}")
            st.markdown(f"**Breakdown**: {data['breakdown']}")
            st.markdown(f"**Feedback**: {data['feedback']}")
            st.markdown("---")

    if st.button("📤 Export as PDF"):
        file = export_feedback_to_pdf(
            user_id,
            prompt,
            st.session_state.get("breakdown", ""),
            st.session_state.get("feedback", "")
        )
        st.success(f"PDF exported as: {file}")
        with open(file, "rb") as f:
            st.download_button("⬇️ Download PDF", f, file_name=file)

    if st.button("🧠 Detect AI-generated Content"):
        if draft.strip() == "":
            st.warning("Please enter a draft to analyze.")
        else:
            with st.spinner("Analyzing with Gemini..."):
                result = detect_ai_generated_content(draft)
                st.markdown(f"### {result['indicator']}")
                st.markdown(result['explanation'])
                save_ai_detection_report(user_id, draft, result)
                st.success("AI analysis saved.")

    if st.checkbox("📂 View My AI Detection History"):
        docs = db.collection("ai_detection_reports").where("user_id", "==", user_id).stream()
        for doc in docs:
            data = doc.to_dict()
            st.write(f"🕒 {data['timestamp'].strftime('%Y-%m-%d %H:%M')}")
            st.markdown(f"{data['indicator']}")
            st.markdown(f"**Confidence:** {data['confidence']}")
            st.markdown(f"**Explanation:**\n{data['explanation']}")
            st.markdown("---")

    if st.checkbox("🌐 View Web-Based AI Detection Logs"):
        docs = db.collection("web_detection_reports").where("user_id", "==", user_id).stream()
        for doc in docs:
            data = doc.to_dict()
            st.write(f"🕒 {data['timestamp'].strftime('%Y-%m-%d %H:%M')}")
            st.markdown(f"{data['indicator']}")
            st.markdown(f"**Confidence:** {data['confidence']}")
            st.markdown(f"**Explanation:** {data['explanation']}")
            st.markdown(f"**Text:**\n{data['text']}")
            st.markdown("---")





    # Logout
    if st.button("🚪 Logout"):
        st.session_state.clear()
        st.success("You have been logged out.")

else:
    st.warning("🔐 Please log in to access the Academic Integrity Agent tools.")
