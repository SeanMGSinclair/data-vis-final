import pandas as pd

df = pd.read_csv('clean_dataset.csv')
df['explicit'] = df['explicit'].replace({True: 'Explicit', False: 'Non-Explicit'})
non_explicit_df = df.loc[df['explicit'] == 'Non-Explicit']
non_explicit_df.to_csv('non_explicit.csv')

explicit_df = df.loc[df['explicit'] == 'Explicit']
explicit_df.to_csv('explicit.csv')


