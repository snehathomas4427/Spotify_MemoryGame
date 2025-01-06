import random
import spotipy
import os
import requests
from dotenv import load_dotenv 
from spotipy.oauth2 import SpotifyClientCredentials
from album_details import AlbumDetails

load_dotenv()  # Automatically loads variables from the .env file

class API:
    def __init__(self):
        self.client_id = os.getenv('SPOTIPY_CLIENT_ID')
        self.client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')
        self.redirect_uri = os.getenv('SPOTIPY_REDIRECT_URI')

        #print(client_id, client_secret, redirect_uri)

    def album_data(self, playlist):
        playlist = playlist.split('/')
        spot_id = playlist[-1]
        auth_manager = SpotifyClientCredentials(self.client_id, self.client_secret)
        sp = spotipy.Spotify(auth_manager=auth_manager)
        playlists = sp.user_playlist(self.client_id, spot_id) #['images'] has the urls for every song in the playlist's album cover 
        '''for i in playlists.keys():
            print(playlists[i])'''
        #get random sample of 8 urls for a 4x4 memory card game
        urls = []
        for item in playlists['tracks']['items']:
            album_images = item['track']['album']['images']
            # Each album has multiple image sizes, let's get the largest one (first one)
            if album_images:
                urls.append(album_images[0]['url'])
        random_urls = random.sample(urls, 8)
        print(random_urls)
        return random_urls
    
    def album_music(self, playlist):
        pass
        
        #album_details = AlbumDetails(random_urls)
        
        
'''def main():
    api = API()
    api.album_data('https://open.spotify.com/playlist/3SL6z8bN3TiXzm1e3uDp6E')

main()'''