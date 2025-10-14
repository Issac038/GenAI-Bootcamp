import requests
import json

API_KEY = "AIzaSyBoIgAwmMXKk6y1nyJtqQtglNMzAW6l8Lg"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

PROMPT = "List three benefits of daily exercise"

headers = {
    "Content-Type": "application/json"
}

data = {
    "contents": [{
        "parts": [{"text": PROMPT}]
    }]
}

response = requests.post(API_URL, headers=headers, json=data)
reply = response.json()

if response.status_code == 200 and 'candidates' in reply:
    print(reply['candidates'][0]['content']['parts'][0]['text'])
else:
    print("Error:", reply.get('error', {}).get('message', 'Unknown error'))