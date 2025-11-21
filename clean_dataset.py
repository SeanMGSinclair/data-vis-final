import pandas as pd


df = pd.read_csv('dataset.csv')

df = df.sort_values(by='popularity', ascending=False)
df = df.drop_duplicates(subset=['track_name','artists'])
df = df.loc[df['popularity'] > 0]


df.to_csv('clean_dataset.csv')

df = df.drop_duplicates(subset=['track_genre'])
genres = df['track_genre'].tolist()

with open('genres.txt', 'w') as f:
    for genre in genres: 
        f.write(f'{genre}\n')



