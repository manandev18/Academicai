from firebase_admin import auth, firestore
from .firebase_config import db
import requests
from dotenv import load_dotenv

load_dotenv()

def create_user(email,password,full_name):
    try:
        user = auth.create_user(email = email, password = password )
        db.collection("users").document(user.uid).set({
            "email":email,
            "full_name":full_name
        })
        return True, "User created successfully"
    except Exception as e:
        return False, str(e)

def login_user(email,password,api_key):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {
        "email":email,
        "password":password,
        "returnSecureToken":True
    }
    try:
        r = requests.post(url,json = payload)
        if r.status_code == 200:
            return True, r.json()
        else:
            return False, r.json()["error"]["message"]
    except Exception as e:
        return False, str(e)