import pandas as pd


df = pd.read_csv('dataset.csv')

sorted_df = df.sort_values(by='popularity', ascending=False)
clean_df = sorted_df.drop_duplicates(subset=['track_name','artists'])

clean_df.to_csv('clean_dataset.csv')

genre_df = clean_df.drop_duplicates(subset=['track_genre'])
genres = genre_df['track_genre'].tolist()

with open('genres.txt', 'w') as f:
    for genre in genres: 
        f.write(f'{genre}\n')



