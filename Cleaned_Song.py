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

df["track_genre"] = df["track_genre"].astype(str).str.lower()

genre_mapping = {
    # 1. Acoustic / Folk
    "acoustic": "Acoustic / Folk",
    "folk": "Acoustic / Folk",
    "singer-songwriter": "Acoustic / Folk",
    "guitar": "Acoustic / Folk",
    "bluegrass": "Acoustic / Folk",
    "honky-tonk": "Acoustic / Folk",
    "country": "Acoustic / Folk",

    # 2. Rock – Alternative / Indie
    "alt-rock": "Rock – Alternative / Indie",
    "alternative": "Rock – Alternative / Indie",
    "indie": "Rock – Alternative / Indie",
    "grunge": "Rock – Alternative / Indie",
    "british": "Rock – Alternative / Indie",

    # 3. Rock – Core / Punk
    "punk": "Rock – Core / Punk",
    "emo": "Rock – Core / Punk",
    "hardcore": "Rock – Core / Punk",

    # 4. Rock – Classic / Mainstream
    "rock": "Rock – Classic / Mainstream",
    "rock-n-roll": "Rock – Classic / Mainstream",
    "hard-rock": "Rock – Classic / Mainstream",

    # 5. Metal
    "metal": "Metal",

    # 6. Electronic – House
    "house": "Electronic – House",
    "deep-house": "Electronic – House",

    # 7. Electronic – Techno / Trance
    "techno": "Electronic – Techno / Trance",
    "trance": "Electronic – Techno / Trance",

    # 8. Electronic – EDM / Dance
    "edm": "Electronic – EDM / Dance",
    "dance": "Electronic – EDM / Dance",
    "club": "Electronic – EDM / Dance",
    "disco": "Electronic – EDM / Dance",

    # 9. Electronic – Bass / DnB / Dub
    "drum-and-bass": "Electronic – Bass / DnB / Dub",
    "dubstep": "Electronic – Bass / DnB / Dub",
    "breakbeat": "Electronic – Bass / DnB / Dub",

    # 10. Electronic – Ambient / Chill / Sleep
    "ambient": "Electronic – Ambient / Chill / Sleep",
    "chill": "Electronic – Ambient / Chill / Sleep",

    # 11. Hip-Hop / R&B
    "hip-hop": "Hip-Hop / R&B",
    "r-n-b": "Hip-Hop / R&B",
    "soul": "Hip-Hop / R&B",

    # 12. Jazz
    "jazz": "Jazz",

    # 13. Blues
    "blues": "Blues",

    # 14. Classical / Opera
    "classical": "Classical / Opera",
    "opera": "Classical / Opera",

    # 15. Musical Theatre / Show Tunes
    "show-tunes": "Musical Theatre / Show Tunes",
    "comedy": "Musical Theatre / Show Tunes",

    # 16. Children / Kids
    "children": "Children / Kids",
    "kids": "Children / Kids",
    "disney": "Children / Kids",

    # 17. Latin – General
    "latin": "Latin – General",

    # 18. Latin – Brazil
    "brazil": "Latin – Brazil",
    "samba": "Latin – Brazil",

    # 19. Latin – Dance / Caribbean
    "reggaeton": "Latin – Dance / Caribbean",
    "dancehall": "Latin – Dance / Caribbean",
    "reggae": "Latin – Dance / Caribbean",

    # 20. Asian – Chinese / HK / Taiwan
    "cantopop": "Asian – Chinese / HK / Taiwan",
    "mandopop": "Asian – Chinese / HK / Taiwan",

    # 21. Asian – Japan
    "j-pop": "Asian – Japan",
    "anime": "Asian – Japan",

    # 22. Asian – Korea
    "k-pop": "Asian – Korea",

    # 23. South Asia / Middle East
    "indian": "South Asia / Middle East",

    # 24. African & Afro-Fusion
    "afro": "African & Afro-Fusion",
    "afrobeat": "African & Afro-Fusion",

    # 25. Mood / Miscellaneous
    "romance": "Mood / Miscellaneous",
    "happy": "Mood / Miscellaneous",
    "party": "Mood / Miscellaneous"
}

def map_genre(raw_genre):
    for key in genre_mapping:
        if key in raw_genre:
            return genre_mapping[key]
    return "Other"

df["track_genre"] = df["track_genre"].apply(map_genre)

columns_to_use = [
    "track_name", "artists", "track_genre",
    "popularity", "danceability", "energy", "loudness", "mode", "speechiness",
    "acousticness", "instrumentalness", "liveness", "valence", "tempo"
]

final_df = df[columns_to_use]

before_na = len(final_df)
final_df = final_df.dropna()
after_na = len(final_df)
print(f"Rows with missing values removed: {before_na - after_na}")


numeric_cols = [
    "popularity", "danceability", "energy", "loudness", "mode", "speechiness",
    "acousticness", "instrumentalness", "liveness", "valence", "tempo"
]

for col in numeric_cols:
    mean = final_df[col].mean()
    std = final_df[col].std()
    lower_bound = mean - 3 * std
    upper_bound = mean + 3 * std
    final_df = final_df[(final_df[col] >= lower_bound) & (final_df[col] <= upper_bound)]

print(f"Total rows remaining: {len(final_df)}")

final_df.to_csv("song.csv", index=False)
print("Cleaned dataset saved as song.csv")
