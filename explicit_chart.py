import pandas as pd

df = pd.read_csv('clean_dataset.csv')
non_explicit_df = df.copy()
non_explicit_df = df.loc[df['explicit'] == False]
non_explicit_df.to_csv('non_explicit.csv')

explicit_df = df.copy()
explicit_df = df.loc[df['explicit'] == True]
explicit_df.to_csv('explicit.csv')


