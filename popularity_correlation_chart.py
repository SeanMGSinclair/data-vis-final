import pandas as pd


def find_correlation(genre):
    if genre != 'All':
        genre_df = df_no_zeroes.loc[df_no_zeroes['track_genre'] == genre]
    else:
        genre_df = df_no_zeroes
    coefficients = []
    genre_column = []
    for metric in metrics:
        coefficient = genre_df['popularity'].corr(genre_df[metric])
        coefficients.append(coefficient)
        genre_column.append(genre)
    correlations = list(zip(metrics, coefficients, genre_column))
    return pd.DataFrame(correlations, columns=['Metric', 'Correlation', 'Genre'])
    

df = pd.read_csv('clean_dataset.csv')
df_no_zeroes = df.loc[df['popularity']>0]
metrics = ['duration_ms', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']
genres = []
vis_dfs = []
with open('genres.txt', 'r') as f:
    genres = f.read().splitlines()
genres.insert(0,'All')
for genre in genres:
    popularity_correlation_df = find_correlation(genre)
    vis_dfs.append(popularity_correlation_df)

final_visualization_data = pd.concat(vis_dfs)
final_visualization_data.to_csv('popularity_correlation.csv')
    



