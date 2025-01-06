#stores the URL endpoints/routes (ex: login page, home page, etc.) 
from flask import Flask, render_template, request
import requests
from api import API
from album_details import AlbumDetails

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    api = API()
    urls = api.album_data('https://open.spotify.com/playlist/5DKWQ8CVKP5UtNEO5QMeKS')
    #urls = api.album_data('https://open.spotify.com/playlist/1Di2mSyh9RbtquVFNYEby0') #this is my personal playlist
    album_details = AlbumDetails(urls)

    return render_template("index.html", album_details = album_details)

if __name__=='__main__':
    app.run(debug=True)