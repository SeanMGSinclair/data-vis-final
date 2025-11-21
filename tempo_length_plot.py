import pandas as pd

df = pd.read_csv('clean_dataset.csv')
artist_df = df.drop_duplicates(subset=['artists'])
artists = artist_df['artists'].tolist()
artists_copy = artists.copy()
for artist in artists_copy:
    if ';' in artist:
        artists.remove(artist)

for i in range(10):
    print(artists[i])
print(len(artists))

tempos = []
durations = []
loudness = []

for i in range(200):
    artist_df = df.loc[df['artists'] == artists[i]]
    tempos.append(artist_df['tempo'].mean())
    durations.append((artist_df['duration_ms'].mean())/60000.0)
    loudness.append(artist_df['loudness'].mean())

artist_stats = list(zip(artists, tempos, durations, loudness))
artists_stats_df = pd.DataFrame(artist_stats, columns=['artist', 'tempo', 'duration', 'loudness'])
artists_stats_df.to_csv('artist_stats.csv')

