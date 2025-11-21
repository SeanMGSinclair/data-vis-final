import pandas as pd

df = pd.read_csv("dataset.csv")

initial_rows = len(df)

unnamed_cols = df.columns[df.columns.str.contains("^Unnamed")]
df = df.loc[:, ~df.columns.str.contains("^Unnamed")]
print(f"Removed {len(unnamed_cols)} unnamed columns: {list(unnamed_cols)}")

before_dupes = len(df)
df = df.drop_duplicates(subset=["track_name", "artists"])
after_dupes = len(df)
print(f"Duplicate rows removed: {before_dupes - after_dupes}")

num_df = df.select_dtypes(include="number")

#talk with jason and sean to comfirm which columns to use
columns_to_use = [
    "popularity","danceability","energy","loudness","mode","speechiness",
    "acousticness","instrumentalness","liveness","valence","tempo"
]

selected_df = num_df[columns_to_use]

before_na = len(selected_df)
selected_df = selected_df.dropna()
after_na = len(selected_df)
print(f"Rows with missing numeric values removed: {before_na - after_na}")

for col in selected_df.columns:
    print(f"{col}: min = {selected_df[col].min()}, max = {selected_df[col].max()}")

print(f"Total rows originally: {initial_rows}")
print(f"Final rows used for correlation: {after_na}")
print(f"Total rows removed overall: {initial_rows - after_na}")

corr = selected_df.corr()
corr.index.name = "feature"

corr.to_csv("corr10.csv")
print("Correlation saved as corr10.csv")
