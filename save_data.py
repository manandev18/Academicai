import datetime
import sys
import os
from firebase_utils.firebase_config import db

def save_assignment_data(user_id, prompt, breakdown, feedback):
    data = {
        "user_id":user_id,
        "prompt":prompt,
        "breakdown":breakdown,
        "feedback":feedback,
        "timestamp":datetime.datetime.utcnow()
        
    }
    db.collection("assignments").add(data)

def save_ai_detection_report(user_id, draft, report):
    doc = {
        "user_id": user_id,
        "draft": draft,
        "confidence": report["confidence"],
        "explanation": report["explanation"],
        "indicator": report["indicator"],
        "timestamp": datetime.datetime.now()
    }
    db.collection("ai_detection_reports").add(doc)