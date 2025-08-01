import firebase_admin 
import os
from firebase_admin import credentials, firestore, auth

# Get the directory where this file is located
current_dir = os.path.dirname(os.path.abspath(__file__))
cred = credentials.Certificate(os.path.join(current_dir, "firebase-key.json"))

# Check if Firebase app is already initialized
try:
    firebase_admin.get_app()
except ValueError:
    # No app exists, initialize it
    firebase_admin.initialize_app(cred)

db = firestore.client()