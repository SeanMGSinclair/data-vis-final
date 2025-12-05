import pandas as pd

def createFile(filename, items):
    with open(filename, "w", encoding="utf-8") as f:
        for item in items:
            f.write(f"\"{item}\",\n")

df = pd.read_csv('dataset.csv')
df = df.dropna(subset=['artists'])
df = df.drop_duplicates(subset='track_name', keep='first')
df = df.sort_values(by='popularity', ascending=False).head(8000)

df["artists"] = df["artists"].str.split(";").apply(lambda lst: [a.strip() for a in lst])

df.to_csv('radar_chart_songs.csv')

list_of_songs = df['track_name'].unique().tolist()

createFile("list_of_songs.txt", list_of_songs)


df_artists = df.explode("artists")

artist_avgs = (
    df_artists
    .groupby("artists")[["danceability", "energy", "valence", "acousticness", "speechiness"]]
    .mean()
)

list_of_artists = df_artists['artists'].unique().tolist()

createFile("list_of_artists.txt", list_of_artists)

artist_avgs.to_csv('radar_chart_artist_avg.csv')





#Create to CSV Files, one for the songs in general and another for the artist's catalogue.
#CSV File containing just the 


