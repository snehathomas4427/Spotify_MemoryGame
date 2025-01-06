import requests
import base64
import os
import json

#get client id and client secret from spotify dashboard 
client_id = '05462f6ae2304198af2a02e646144157' 
client_secret = '2b9e02f8f9ae4ed196e3f344bfaf5d9a'
#client_id = os.getenv('SPOTIPY_CLIENT_ID')
#client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')

# Encode client ID and secret in Base64
auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()

# Define the auth options
auth_url = 'https://accounts.spotify.com/api/token'
auth_headers = {
    'Authorization': f'Basic {auth_header}'
}
auth_data = {
    'grant_type': 'client_credentials'
}

# Make the POST request
response = requests.post(auth_url, headers=auth_headers, data=auth_data)

if response.status_code == 200:
    #token = response.json().get('access_token')
    #print("Access token:", token)
    token = response.json()
    file = open("MemoryGame/python/.cache", "w")
    file.write(json.dumps(token))
    file.close()
    
else:
    print("Failed to get token:", response.status_code, response.text)
