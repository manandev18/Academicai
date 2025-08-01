# config.py
import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core import exceptions

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")

# Prompt Breakdown
def breakdown_assignment(prompt:str)->str:
    try:
        system_prompt = """
        You are an academic writing guide. Break this assignment  into logical sections, each with a heading, purpose, and suggested word count.
        Format:
        1. Section Title - Purpose (Word Count)

        """
        response = model.generate_content(system_prompt + "\n\nAssignment: " + prompt)
        return response.text
    except exceptions.ResourceExhausted:
        return "⚠️ **API Quota Exceeded**: You've reached the free tier limit. Please try again later or upgrade your plan."
    except Exception as e:
        return f"❌ **Error**: {str(e)}"

# Suggest sources
def suggest_sources(topic:str)->str:
    try:
        prompt = f"""
        Suggest 3 reliable and ethical resources (books, research papers, websites, etc.) a student can refer for writing on:
        `{topic}`.
        Provide citation format."""

        return model.generate_content(prompt).text
    except exceptions.ResourceExhausted:
        return "⚠️ **API Quota Exceeded**: You've reached the free tier limit. Please try again later or upgrade your plan."
    except Exception as e:
        return f"❌ **Error**: {str(e)}"

# Draft Review & Feedback
def review_draft(draft: str) -> str:
    try:
        prompt = f"""
        You're an academic writing coach.
        Review the following draft for:
        - Originality (not generic or repetitive)
        - Clarity and academic tone
        - Logical flow

        Give section-wise feedback.
        Draft:
        {draft}
        """
        return model.generate_content(prompt).text
    except exceptions.ResourceExhausted:
        return "⚠️ **API Quota Exceeded**: You've reached the free tier limit. Please try again later or upgrade your plan."
    except Exception as e:
        return f"❌ **Error**: {str(e)}"

# AI/Plagiarism Check
def detect_ai_generated_content(text: str) -> str:
    try:
        prompt = f"""
        Analyze the following text and determine if it sounds AI-generated, vague, or lacks critical thinking.
        Explain why, and suggest human-like refinements.

        Text:
        {text}
        """
        return model.generate_content(prompt).text
    except exceptions.ResourceExhausted:
        return "⚠️ **API Quota Exceeded**: You've reached the free tier limit. Please try again later or upgrade your plan."
    except Exception as e:
        return f"❌ **Error**: {str(e)}"
